# VIETLOTT AI QUANT & PREDICTION ENGINE 🚀
> Hệ thống Định Lượng Toán Học, Phân Tích Xác Suất Chuyên Sâu & Dự Đoán Kết Quả Xổ Số Vietlott (Mega 6/45, Power 6/55)

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

---

## ⚡ 2. Hệ Thống Theo Dõi Kết Quả Trực Tiếp (Live Follow & Tracker)

- **Auto Sync / Live Crawler**: Tự động đồng bộ kết quả mới nhất từ hệ thống quay thưởng Vietlott.
- **Next Draw Countdown & Jackpot Estimator**: Đếm ngược thời gian mở thưởng và ước tính giá trị Jackpot lũy tiến.
- **Portfolio & Auto Win Checker**: Lưu danh mục vé đã dự đoán / đã mua và tự động đối chiếu giải thưởng (Jackpot, Giải 1, Giải 2, Giải 3) ngay khi có kết quả mới.
- **Walk-Forward Backtesting**: Chạy máy kiểm thử ngược thời gian trên các kỳ quay lịch sử để đánh giá tỷ lệ trúng thực tế so với xác suất ngẫu nhiên.

---

## 🖥️ 3. Hướng Dẫn Khởi Chạy (Quick Start)

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
