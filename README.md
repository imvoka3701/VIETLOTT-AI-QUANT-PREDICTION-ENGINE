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

## 🖥️ 4. Hướng Dẫn Khởi Chạy (Quick Start)

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

