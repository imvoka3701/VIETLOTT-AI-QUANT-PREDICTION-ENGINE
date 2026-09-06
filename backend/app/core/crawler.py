import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from typing import Dict, Any, List, Optional
from .database import (
    insert_or_update_draw,
    get_latest_draw,
    get_connection,
    insert_many_draws,
    insert_many_keno_draws,
    clear_mock_data_for_game,
    get_total_draws_count
)
from ..config import SUPPORTED_GAMES

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7"
}

def fetch_vietlott_jackpot_and_latest(game_type: str = "mega645") -> Optional[Dict[str, Any]]:
    """
    Crawls the official Vietlott detail page (645.html / 655.html)
    to get the most recent winning draw and EXACT real-time Jackpot values down to the VNĐ.
    """
    url_slug = "645.html" if game_type == "mega645" else "655.html"
    url = f"https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/{url_slug}"

    try:
        r = requests.get(url, headers=HEADERS, timeout=12)
        if r.status_code != 200:
            return None

        soup = BeautifulSoup(r.text, "html.parser")

        # 1. Parse Draw ID & Date from header detail
        detail_div = soup.find(class_=re.compile(r'chitietketqua', re.I))
        detail_text = detail_div.get_text(" ", strip=True) if detail_div else soup.get_text()

        draw_id_m = re.search(r'#(\d{5})', detail_text)
        draw_id = draw_id_m.group(1) if draw_id_m else None

        date_m = re.search(r'ngày\s*(\d{2}/\d{2}/\d{4})', detail_text, re.I)
        raw_date = date_m.group(1) if date_m else datetime.now().strftime("%d/%m/%Y")
        try:
            d_obj = datetime.strptime(raw_date, "%d/%m/%Y")
            draw_date = d_obj.strftime("%Y-%m-%d")
        except Exception:
            draw_date = datetime.now().strftime("%Y-%m-%d")

        # 2. Parse Numbers & Bonus from official ball elements
        bong_elems = soup.find_all(class_='bong_tron')
        found_nums = [int(b.get_text(strip=True)) for b in bong_elems if b.get_text(strip=True).isdigit()]

        balls: List[int] = []
        bonus_num: Optional[int] = None

        if len(found_nums) >= 6:
            balls = sorted(found_nums[:6])
            if game_type == "power655" and len(found_nums) >= 7:
                bonus_num = found_nums[6]
        else:
            # Fallback regex on detail_text
            num_matches = re.findall(r'\b\d{2}\b', detail_text)
            max_limit = 45 if game_type == "mega645" else 55
            valid_main = [int(n) for n in num_matches if 1 <= int(n) <= max_limit]
            if len(valid_main) >= 6:
                balls = sorted(valid_main[:6])

        # 3. Parse Exact Jackpot values
        jp1_val = 12_000_000_000.0 if game_type == "mega645" else 30_000_000_000.0
        jp2_val = 0.0

        for gt in soup.find_all(class_=re.compile(r'gt_jackpot', re.I)):
            gt_text = gt.get_text(" ", strip=True)
            if game_type == "mega645":
                m = re.search(r'([\d\.\,]+)\s*VNĐ', gt_text, re.I)
                if m:
                    clean_str = m.group(1).replace('.', '').replace(',', '')
                    if clean_str.isdigit():
                        jp1_val = float(clean_str)
            else:
                m1 = re.search(r'Jackpot 1\s*([\d\.\,]+)\s*VNĐ', gt_text, re.I)
                if m1:
                    clean_str1 = m1.group(1).replace('.', '').replace(',', '')
                    if clean_str1.isdigit():
                        jp1_val = float(clean_str1)
                m2 = re.search(r'Jackpot 2\s*([\d\.\,]+)\s*VNĐ', gt_text, re.I)
                if m2:
                    clean_str2 = m2.group(1).replace('.', '').replace(',', '')
                    if clean_str2.isdigit():
                        jp2_val = float(clean_str2)

        if draw_id and len(balls) == 6:
            return {
                "game_type": game_type,
                "draw_id": draw_id,
                "draw_date": draw_date,
                "numbers": balls,
                "bonus_number": bonus_num,
                "jackpot1_value": jp1_val,
                "jackpot2_value": jp2_val
            }
    except Exception as e:
        print(f"Error crawling latest Vietlott {game_type}: {e}")

    return None

def fetch_vietlott_history_via_ajax(game_type: str = "mega645", max_pages: int = 5) -> List[Dict[str, Any]]:
    """
    Crawls historical winning numbers directly via Vietlott's AjaxPro endpoints.
    Each page yields 10 draws. 5 pages = 50 historical real draws.
    """
    webpart_name = "Game645CompareWebPart" if game_type == "mega645" else "Game655CompareWebPart"
    url_ashx = f"https://vietlott.vn/ajaxpro/Vietlott.PlugIn.WebParts.{webpart_name},Vietlott.PlugIn.WebParts.ashx"
    url_render = "https://vietlott.vn/ajaxpro/Vietlott.Utility.WebEnvironments,Vietlott.Utility.ashx"

    session = requests.Session()
    headers = {
        "User-Agent": HEADERS["User-Agent"],
        "X-AjaxPro-Method": "ServerSideFrontEndCreateRenderInfo",
        "Content-Type": "text/plain; charset=utf-8"
    }

    draws_collected = []
    try:
        # Step 1: Create RenderInfo
        r1 = session.post(url_render, data=json.dumps({"SiteId": "main.frontend.vi"}), headers=headers, timeout=10)
        render_info = r1.json().get("value")
        if not render_info:
            return []
        render_info["SiteLang"] = "vi"

        # Step 2: Query pages
        for page in range(max_pages):
            draw_headers = {
                "User-Agent": HEADERS["User-Agent"],
                "X-AjaxPro-Method": "ServerSideDrawResult",
                "Content-Type": "text/plain; charset=utf-8"
            }
            payload = {
                "ORenderInfo": render_info,
                "Key": "68a8f378",
                "GameDrawId": "",
                "ArrayNumbers": None,
                "CheckMulti": False,
                "PageIndex": page
            }
            res = session.post(url_ashx, data=json.dumps(payload), headers=draw_headers, timeout=10)
            if res.status_code != 200:
                continue

            html_content = res.json().get("value", {}).get("HtmlContent", "")
            if not html_content:
                continue

            soup = BeautifulSoup(html_content, "html.parser")
            rows = soup.find_all("tr")
            for row in rows:
                tds = row.find_all("td")
                if len(tds) >= 3:
                    raw_date = tds[0].get_text(strip=True)
                    draw_id = tds[1].get_text(strip=True)
                    raw_nums = tds[2].get_text(strip=True)

                    # Standardize Date YYYY-MM-DD
                    try:
                        d_obj = datetime.strptime(raw_date, "%d/%m/%Y")
                        draw_date = d_obj.strftime("%Y-%m-%d")
                    except Exception:
                        draw_date = raw_date

                    bonus_val = None
                    if "|" in raw_nums:
                        main_part, bonus_part = raw_nums.split("|")
                        nums = [int(main_part[i:i+2]) for i in range(0, len(main_part), 2) if len(main_part[i:i+2]) == 2]
                        if bonus_part.strip().isdigit():
                            bonus_val = int(bonus_part.strip())
                    else:
                        nums = [int(raw_nums[i:i+2]) for i in range(0, len(raw_nums), 2) if len(raw_nums[i:i+2]) == 2]

                    if len(nums) == 6:
                        draws_collected.append({
                            "game_type": game_type,
                            "draw_id": draw_id,
                            "draw_date": draw_date,
                            "numbers": sorted(nums),
                            "bonus_number": bonus_val,
                            "jackpot1_value": 0.0,
                            "jackpot2_value": 0.0
                        })
    except Exception as e:
        print(f"Error fetching historical Ajax Vietlott for {game_type}: {e}")

    return draws_collected

def fetch_keno_latest() -> List[Dict[str, Any]]:
    """
    Crawls live Keno draws from winning-number-keno.
    Returns list of latest ~6-10 draws with 20 balls, even/odd, and big/small status.
    """
    url = "https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/winning-number-keno"
    keno_list = []
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code != 200:
            return []

        soup = BeautifulSoup(r.text, "html.parser")
        table = soup.find("table")
        if table:
            for row in table.find_all("tr")[1:]:
                tds = row.find_all("td")
                if len(tds) >= 4:
                    col0 = tds[0].get_text(strip=True)  # Format: 06/09/2026#0294695
                    if "#" in col0:
                        date_raw, draw_id = col0.split("#")
                    else:
                        date_raw = col0
                        draw_id = ""

                    try:
                        d_obj = datetime.strptime(date_raw, "%d/%m/%Y")
                        draw_date = d_obj.strftime("%Y-%m-%d")
                    except Exception:
                        draw_date = date_raw

                    raw_nums = tds[1].get_text(strip=True)
                    nums = [int(raw_nums[i:i+2]) for i in range(0, len(raw_nums), 2) if len(raw_nums[i:i+2]) == 2]
                    even_odd = tds[2].get_text(strip=True)
                    big_small = tds[3].get_text(strip=True)

                    if len(nums) == 20:
                        keno_list.append({
                            "draw_id": draw_id,
                            "draw_date": draw_date,
                            "numbers": sorted(nums),
                            "even_odd": even_odd,
                            "big_small": big_small
                        })
    except Exception as e:
        print(f"Error crawling Keno: {e}")

    return keno_list

def sync_real_vietlott_data(game_type: str = "mega645") -> Dict[str, Any]:
    """
    Master sync method:
    1. Fetches real latest draw + exact Jackpot.
    2. Fetches historical real draws (30-50 draws).
    3. Replaces mock dataset if local data is synthetic.
    """
    result = {
        "success": False,
        "game_type": game_type,
        "new_draws_count": 0,
        "message": "",
        "latest_draw": None
    }

    # Fetch latest real draw with exact Jackpot
    latest_real = fetch_vietlott_jackpot_and_latest(game_type)
    
    # Fetch historical draws
    hist_draws = fetch_vietlott_history_via_ajax(game_type, max_pages=4)

    if not latest_real and not hist_draws:
        result["message"] = f"Không thể kết nối đến máy chủ vietlott.vn cho {game_type}."
        return result

    # Check if database currently has mock data (or < 10 draws)
    # Real 645 is around #01550+, real 655 is around #01390+
    curr_latest = get_latest_draw(game_type)
    is_mock = False
    if curr_latest:
        curr_id = int(curr_latest["draw_id"]) if curr_latest["draw_id"].isdigit() else 0
        if game_type == "mega645" and curr_id < 1500:
            is_mock = True
        elif game_type == "power655" and curr_id < 1300:
            is_mock = True

    if is_mock:
        print(f"[*] Clearing synthetic mock data for {game_type} to import 100% REAL Vietlott history...")
        clear_mock_data_for_game(game_type)

    # Insert historical draws
    inserted_count = 0
    if hist_draws:
        inserted_count = insert_many_draws(hist_draws)

    # Update the latest draw with exact Jackpot value
    if latest_real:
        insert_or_update_draw(
            game_type=latest_real["game_type"],
            draw_id=latest_real["draw_id"],
            draw_date=latest_real["draw_date"],
            numbers=latest_real["numbers"],
            bonus_number=latest_real["bonus_number"],
            jackpot1=latest_real["jackpot1_value"],
            jackpot2=latest_real["jackpot2_value"]
        )
        result["latest_draw"] = latest_real
    else:
        result["latest_draw"] = get_latest_draw(game_type)

    result["success"] = True
    result["new_draws_count"] = inserted_count
    jp_info = ""
    if latest_real:
        jp1_bil = round(latest_real["jackpot1_value"] / 1_000_000_000, 2)
        jp_info = f" (Jackpot: {jp1_bil} tỷ VNĐ)"

    result["message"] = (
        f"Đã đồng bộ thành công dữ liệu THỰC TẾ từ vietlott.vn cho {SUPPORTED_GAMES[game_type]['name']} "
        f"- Kỳ #{result['latest_draw']['draw_id'] if result['latest_draw'] else ''}{jp_info}!"
    )
    return result

def crawl_vietlott_online(game_type: str = "mega645") -> Dict[str, Any]:
    """Compatibility interface matching existing API call signatures"""
    if game_type == "keno":
        keno_items = fetch_keno_latest()
        saved = insert_many_keno_draws(keno_items)
        return {
            "success": True,
            "new_draws_count": saved,
            "message": f"Đã đồng bộ {saved} kỳ quay Keno thời gian thực!",
            "latest_draw": keno_items[0] if keno_items else None
        }
    return sync_real_vietlott_data(game_type)
