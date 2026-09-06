# VIETLOTT AI QUANT & ALL-LOTTERY PREDICTION ENGINE 🚀
> Hệ thống Định Lượng Toán Học, Phân Tích Xác Suất Toàn Diện & Soi Cầu Minh Bạch Cho Toàn Bộ Các Hạng Mục Xổ Số: Vietlott (Mega 6/45, Power 6/55, Keno 10 Phút) và Xổ Số Truyền Thống 3 Miền (XSMB, XSMN, XSMT).

---

## 🎯 1. Các Trụ Cột Thuật Toán Nâng Cao (Advanced Algorithmic Stack)

1. **Ma Trận Chuyển Trạng Thái Markov (Markov Transition Chain)**:
   - Xây dựng ma trận xác suất chuyển trạng thái $T_{N \times N}$ phân tích khả năng bóng $j$ về ở kỳ $t+1$ khi bóng $i$ đã về ở kỳ $t$.
2. **Suy Diễn Bayes & Mô Hình Hazard Decay (Bayesian Inference & Weibull Hazard)**:
   - Cập nhật xác suất hậu nghiệm (Posterior Probability) kết hợp hàm nguy cơ (Hazard Function) dựa trên thời gian vắng mặt (Lag/Gap) của từng bóng.
3. **Mô Hình Học Máy Đặc Trưng Chuỗi (Rolling Feature ML Classifier)**:
   - Trích xuất 15+ đặc trưng (EMA tần suất ngắn/trung/dài hạn, gia tốc chu kỳ, độ lệch chuẩn, độ hỗn loạn entropy) và xếp hạng điểm tiềm năng qua Random Forest / Gradient Boosting.
4. **Mô Phỏng Đa Luồng Monte Carlo (50,000 - 100,000 Iterations)**:
   - Giả lập hàng trăm nghìn lượt quay ảo để đo lường phân phối chuẩn tổng điểm (Gaussian Sum Distribution) và phát hiện các cụm số có mật độ xuất hiện tối ưu.
5. **Thuật Toán Di Truyền Tối Ưu Bộ Số (Multi-Objective Genetic Algorithm - GA)**:
   - Tiến hóa quần thể hàng trăm thế hệ để sinh ra các bộ vé thỏa mãn các điều kiện Pareto (tổng điểm, phân bố chẵn/lẻ, khoảng cách phân tán, bóng bắt buộc, bóng loại trừ).
6. **Ma Trận Cặp Đồng Xuất Hiện & Cụm Bộ Ba (Co-occurrence & Triplet Clustering)**:
   - Tính toán ma trận $C(N, 2)$, phát hiện chuỗi bóng rơi liên tiếp (consecutive repeat), và phân tích xác suất điều kiện cặp $P(B|A)$.
7. **Thuật Toán Soi Cầu 3 Miền Chuyên Biệt (XSMB, XSMN, XSMT)**:
   - **Bạch Thủ Lô & Song Thủ Lô**: Kết hợp nhịp gan cực đại, biên độ chu kỳ rơi và xác suất Poisson.
   - **Lô Xiên 2, Xiên 3**: Ghép cặp theo ma trận tương quan đồng quy (Jaccard Similarity).
   - **Dàn Đề Thống Kê**: Tự động sinh dàn đặc biệt 10 số, 20 số, 36 số dựa trên quy luật chạm, tổng và đầu/đuôi.
   - **Tam Giác Cầu Pascal**: Cộng dồn nhị phân đối xứng modulo 10 tự động từ Giải Đặc Biệt và Giải Nhất.
8. **Explainable AI (XAI) - Minh Bạch Lý Do Dự Đoán**:
   - Tránh mô hình hộp đen gây mất niềm tin. Mỗi con số đề xuất đều đi kèm báo cáo trực quan giải trình rõ ràng: Điểm Hazard, Trọng số Markov, Đà xung lượng (Momentum) và khuyến nghị chiến thuật.

---

## ⚡ 2. Đồng Bộ Dữ Liệu Thời Gian Thực (Real-time Live Engine)

- **Official Vietlott.vn Live Crawler**: Thu thập tự động kết quả trực tiếp và giá trị Jackpot chính xác từ máy chủ `vietlott.vn` (Mega 6/45, Power 6/55, Keno 10 phút, Max 3D/3D Pro).
- **Lịch Mở Thưởng Quốc Gia (Timeline Dashboard)**: Hiển thị đầy đủ khung giờ quay thưởng của mọi đài trong ngày (16h15 XSMN, 17h15 XSMT, 18h15 XSMB, 18h00 Vietlott, Keno liên tục 10 phút/kỳ).
- **Keno Live 80-Ball Matrix**: Bảng hiển thị 80 bóng động thời gian thực với phân tích 4 góc phần tư (Q1-Q4), chỉ số Tài/Xỉu, Chẵn/Lẻ và bộ tạo vé Keno AI theo bậc.
- **Portfolio & Auto Win Checker**: Lưu danh mục vé đã dự đoán / đã mua và tự động đối chiếu giải thưởng ngay khi có kết quả mới.
- **Walk-Forward Backtesting**: Kiểm thử ngược thời gian trên dữ liệu lịch sử để đánh giá độ chuẩn xác.

---

## 🔒 3. Kiến Trúc Bảo Mật Cao Cấp (Security Hardening)

- **Sliding-Window Rate Limiter**: Giới hạn tần suất gọi các API tính toán nặng theo IP (chống DoS / lạm dụng tài nguyên).
- **Strict Security Headers**: Áp dụng các chuẩn bảo mật ngân hàng:
  - `X-Frame-Options: DENY` (chống Clickjacking)
  - `X-Content-Type-Options: nosniff` (chống MIME sniffing)
  - `Content-Security-Policy (CSP)` (ngăn chặn XSS)
  - `Strict-Transport-Security (HSTS)`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Safe CORS Configuration**: Kiểm soát chặt chẽ danh sách origin hợp lệ, loại bỏ hoàn toàn cấu hình wildcard `*` đi kèm credentials.

---

## 📖 4. Cẩm Nang & Hướng Dẫn Đặt Cược Thực Tế (Lottery Playbook)

Hệ thống tích hợp bảng hướng dẫn thực chiến chi tiết giúp người dùng chuyển hóa các bộ số xác suất từ Tool thành vé cược ngoài đời thực:

### 1. Quy Trình 3 Bước Chuẩn: "Từ Thuật Toán Ra Tiền Thưởng"
1. **Trích Xuất Bộ Số Tối Ưu**: Lấy vé gợi ý từ AI Ensemble (Mega/Power), thuật toán cân bằng 4 vùng (Keno) hoặc tam giác Pascal & Lô xiên (Soi Cầu 3 Miền). Kiểm tra bảng **Explainable AI (XAI)** để xác nhận số có chỉ số nén chu kỳ gan tốt.
2. **Chọn Kênh Đặt Thưởng Uy Tín**:
   - **Vietlott SMS (App chính hãng)**: Đặt cược trên điện thoại qua Viettel/Mobi/Vina, trả thưởng tự động về tài khoản ngân hàng.
   - **Điểm Bán Hàng POS Vietlott**: Quét mã QR hoặc đọc dãy số đã lưu từ Tool để in vé vật lý.
   - **Đại Lý / Cổng Trực Tuyến Uy Tín**: Đánh Lô Đề, 3 Càng, Xiên với tỷ lệ ưu đãi 1 ăn 99.
3. **Chiến Thuật Quản Lý Vốn (Risk Management)**: Tuân thủ công thức Kelly Criterion, tỷ lệ phân bổ vốn 1-2-4 theo khung nuôi 3 ngày, quy tắc cắt lỗ nghiêm ngặt.

### 2. Phân Khúc Chiến Thuật Cược
- 🔥 **Đánh Lớn Ăn Lớn**:
  - *Vietlott Bao 7 đến Bao 18*: Vốn 70k - 185M, tăng xác suất nổ Jackpot gấp hàng chục lần, trúng kèm hàng trăm giải phụ.
  - *Keno Bậc 9 & 10*: Săn 2 Tỷ - 10 Tỷ VNĐ (Bậc 10 trúng 0/10 vẫn được hoàn vốn 100%).
- 💎 **Đánh Bé Ăn To**:
  - *Vé Đơn 10k*: Vốn nhỏ giá 1 ổ bánh mì săn Jackpot 40 - 100+ Tỷ VNĐ.
  - *Đề 3 Càng & 4 Càng*: Vốn 10k ăn 9.600.000đ (1:960) hoặc 88.000.000đ (1:8800).
  - *Lô Xiên 2, Xiên 3, Xiên 4*: Vốn 20k ăn x10, x40, x100 - x250.
- 🛡️ **Ăn Chắc Mặc Bền (Thu Lãi Hàng Ngày)**:
  - *Dàn Đề 36 Số & 20 Số*: Tỷ lệ thắng 36% - 50%, đánh tỷ lệ 1 ăn 99 sinh lời ròng ~63%.
  - *Song Thủ Lô Kẹp Tã*: Đánh cặp số đối xứng (59 - 95) bảo hiểm chống lộn cầu.
  - *Keno Bậc 2 & Bậc 4*: Ăn x9 đến x40 với xác suất trúng cao nhất.

---

## 🌟 5. Bộ Tiện Ích Thực Chiến Dành Riêng Cho Người Chơi (User-Centric Suite)

1. **🔥 Trung Tâm Thực Chiến "Chốt Số Hôm Nay" (Daily VIP Action Center)**:
   - Tự động hiển thị đài mở thưởng trong ngày và gợi ý ngay **3 Bộ Số Vàng** được AI chấm điểm cao nhất.
   - **1-Click Tạo Cú Pháp Vietlott SMS (9969)**: Soạn sẵn định dạng chuẩn cho Viettel, Mobifone, Vinaphone để gửi cược trong 3 giây.
   - **Thẻ Vé Số Điện Tử Có Mã Vạch**: Hiển thị mô phỏng vé thật để người chơi lưu về điện thoại mang ra quầy POS in vé.
2. **🔮 Sổ Mơ Dân Gian Tích Hợp AI Quant (AI Dream Book)**:
   - Tra cứu hơn 1000+ giấc mơ và sự kiện phong thủy (mơ thấy rắn, mơ thấy tiền, mơ thấy trúng số, tai nạn, cá to...).
   - AI Quant tự động phân tích và chỉ ra con số nào trong giấc mơ đang có xác suất nổ cao nhất trong ngày.
3. **🎯 Máy Dò Vé Thông Minh & Tự Động Tính Thuế TNCN (Smart Win Checker)**:
   - Nhập/chọn 6 số vé của bạn, hệ thống đối soát tức thì với kết quả quay thật trên `vietlott.vn`.
   - Tính toán chính xác tiền thưởng danh nghĩa (Gross) và **số tiền thực nhận về tay (Net Cash)** sau khi tự động khấu trừ 10% thuế TNCN theo Luật Thuế Việt Nam (cho phần thưởng > 10 triệu).
4. **📈 Bảng Cầu Đang Chạy Thông & Bạc Nhớ Đầu Đuôi Câm (Hot Streak Board)**:
   - Theo dõi các cầu ăn thông 3 - 4 ngày liên tiếp.
   - Tra cứu quy luật Bạc Nhớ khi đài hôm qua câm đầu / câm đuôi.
5. **⚡ Công Tắc Chuyển Chế Độ "Thực Chiến" & "Chuyên Gia Quant Pro"**:
   - Chế độ Thực Chiến: Đơn giản, to rõ, dễ hiểu, chốt số nhanh.
   - Chế độ Chuyên Gia: Mở rộng toàn bộ ma trận Markov, Hazard, Monte Carlo, GA và phân tích đặc trưng chuỗi.

---

## 🖥️ 6. Hướng Dẫn Khởi Chạy (Quick Start)

### Cách 1: Chạy 1-Click (Khuyến nghị trên Windows)
Double-click vào file:
```cmd
run_app.bat
```
Hệ thống sẽ tự động khởi động Backend API và mở giao diện Web Dashboard trên trình duyệt tại `http://localhost:5173`.

### Cách 2: Khởi chạy thủ công qua Terminal

**1. Khởi động Backend (FastAPI):**
```powershell
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**2. Khởi động Frontend (React Vite):**
```powershell
cd frontend
npm run dev
```
Truy cập: `http://localhost:5173`  
API Docs Swagger: `http://127.0.0.1:8000/docs`

