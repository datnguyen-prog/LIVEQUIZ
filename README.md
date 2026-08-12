# 🎯 Quiz Trực Tiếp / Live Quiz

Ứng dụng kiểm tra kiến thức sản phẩm theo kiểu Kahoot: người tham gia **quét mã QR** để vào, trả lời trắc nghiệm 4 đáp án, **xếp hạng theo độ chính xác và tốc độ**, kết quả **xuất ra file Excel**.

---

## 1. Cài đặt (chỉ làm 1 lần)

1. Cài **Node.js** bản LTS: https://nodejs.org (bấm Next liên tục là xong)
2. Giải nén thư mục này ra ổ đĩa, ví dụ `D:\live-quiz`
3. Chạy file:
   - **Windows:** nhấp đúp `START-WINDOWS.bat`
   - **Mac/Linux:** mở Terminal, gõ `bash START-MAC-LINUX.sh`

Lần đầu chạy sẽ tự cài thư viện (1–2 phút). Trình duyệt sẽ tự mở `http://localhost:3000`.

> Cửa sổ đen (Terminal) phải **giữ mở** trong suốt buổi thi. Đóng nó là tắt máy chủ.

---

## 2. Dành cho người tổ chức (Host)

### Soạn đề

1. Tab **Thư viện bộ đề** → **Tạo bộ đề mới**
2. Đặt tên bộ đề, chọn **thời gian mặc định** (giây) và **điểm mặc định** mỗi câu
3. Với từng câu: nhập nội dung, 4 đáp án A/B/C/D, rồi bấm **"Đáp án đúng"** ở dòng đáp án chính xác
4. Mỗi câu có thể chỉnh **thời gian** và **điểm** riêng ở góc phải
5. Bấm **💾 Lưu bộ đề**

**Nhập nhanh nhiều câu:** bấm 📋 *Nhập nhanh nhiều câu*, dán theo định dạng 6 dòng mỗi câu, các câu cách nhau 1 dòng trống:

```
TV Coocaa sử dụng hệ điều hành nào?
Google TV
Tizen OS
webOS
VIDAA
A

QLED là viết tắt của?
Quick LED
Quantum Dot LED
Quality LED
Quad LED
B
```

**Nhập từ file:** dùng nút *Nhập từ file* với file `.json` (có sẵn file mẫu `mau-bo-de-vi-du.json`).

### Chạy buổi thi

1. Bấm **▶ Bắt đầu tổ chức** trên bộ đề muốn dùng
2. Màn hình hiện **mã QR** + **mã PIN 6 số** → chiếu lên máy chiếu / TV
3. Nhân viên quét QR bằng camera điện thoại, nhập tên → tên hiện ngay trong danh sách
4. Bấm **▶ Bắt đầu** khi đủ người
5. Mỗi câu: màn hình host hiện câu hỏi + đồng hồ đếm ngược + số người đã trả lời
   - Bấm **⏭ Chốt đáp án ngay** nếu muốn kết thúc câu sớm
   - Hết giờ (hoặc mọi người đã trả lời) → tự hiện đáp án đúng, biểu đồ lựa chọn và **bảng xếp hạng**
6. Bấm **Câu tiếp theo ▶** cho đến hết
7. Màn hình cuối: bảng xếp hạng chung cuộc → **📊 Tải file Excel kết quả**

---

## 3. Dành cho người tham gia

1. Quét mã QR (hoặc mở địa chỉ hiện trên màn hình rồi nhập mã PIN)
2. Nhập tên hiển thị → **Vào phòng**
3. Chọn 1 trong 4 đáp án màu trước khi hết giờ
4. Sau mỗi câu: thấy đúng/sai, điểm nhận được, tổng điểm, hạng của mình và Top 5
5. Kết thúc: thấy bảng xếp hạng chung cuộc

Không cần cài app, không cần đăng ký tài khoản. Điện thoại mất mạng giữa chừng → vào lại là tự khôi phục điểm.

---

## 4. Cách tính điểm

| Trường hợp | Điểm |
|---|---|
| Sai hoặc không trả lời | 0 |
| Đúng, **có** cộng điểm tốc độ (mặc định) | `Điểm câu × (0.5 + 0.5 × thời gian còn lại)` → trả lời ngay được ~100%, trả lời sát giờ được 50% |
| Đúng, **tắt** cộng điểm tốc độ | Đúng bằng điểm câu |

Bỏ tick **"Cộng điểm theo tốc độ trả lời"** trong phần soạn đề nếu muốn chấm thuần đúng/sai.
Khi hai người bằng điểm, ai có **tổng thời gian trả lời ngắn hơn** xếp trên.

---

## 5. File Excel kết quả

File `.xlsx` gồm 3 sheet:

- **Bang xep hang** — hạng, tên, tổng điểm, số câu đúng, tỉ lệ đúng, tổng thời gian
- **Chi tiet tra loi** — từng người × từng câu: đáp án đã chọn, đúng/sai, số giây, điểm
- **Thong ke cau hoi** — câu nào nhiều người sai nhất (dùng để biết cần đào tạo lại nội dung gì)

Bấm nút **📊 Tải file Excel kết quả** ở màn hình cuối. Kết quả cũng được lưu tự động dạng JSON trong thư mục `data/results/`.

---

## 6. Cho nhân viên ở xa vào được (tuỳ chọn)

Mặc định ứng dụng chạy trong mạng LAN — **máy host và điện thoại nhân viên phải dùng chung WiFi**.

Muốn ai ở đâu cũng vào được, deploy lên dịch vụ miễn phí:

**Render.com** (khuyến nghị)
1. Đưa thư mục này lên một repo GitHub
2. Render → *New* → *Web Service* → chọn repo
3. Build Command: `npm install` · Start Command: `node server.js`
4. Xong — dùng địa chỉ Render cấp thay cho `localhost:3000`

**Railway.app / Fly.io** cấu hình tương tự. Ứng dụng tự đọc biến môi trường `PORT`.

> Lưu ý khi deploy: bộ đề và kết quả lưu trong thư mục `data/`. Nhiều dịch vụ miễn phí xoá ổ đĩa khi khởi động lại — nhớ tải file Excel ngay sau mỗi buổi thi.

---

## 7. Xử lý sự cố

### ⚠ Điện thoại không vào được — nguyên nhân hay gặp nhất

**`localhost` chỉ chạy được trên chính máy chủ.** Điện thoại gõ `localhost:3000` là nó tự tìm trong chính điện thoại — không bao giờ ra.

Người tham gia phải dùng **địa chỉ IP trong mạng LAN**, ví dụ `192.168.1.25:3000/play.html`. App đã tự lo việc này: màn hình tổ chức luôn hiển thị đúng địa chỉ IP và mã QR cũng trỏ vào IP đó — cứ đọc đúng dòng chữ to trên màn hình, đừng gõ tay `localhost`.

Nếu vẫn không vào được, kiểm tra theo thứ tự:

1. **Điện thoại và laptop cùng WiFi chưa?** WiFi khách (Guest) thường bị tách khỏi WiFi nội bộ. Tắt 4G/5G trên điện thoại để chắc chắn nó đang đi qua WiFi.
2. **Tường lửa Windows đang chặn.** Lần đầu chạy, Windows hiện hộp thoại "Windows Defender Firewall" — phải bấm **Allow access** và tick cả *Private networks*. Lỡ bấm Cancel thì vào *Windows Security → Firewall & network protection → Allow an app through firewall*, tìm **Node.js**, tick ô **Private**.
3. **Máy có nhiều địa chỉ mạng** (vừa cắm dây LAN vừa bật WiFi, hoặc có VPN/máy ảo). Màn hình tổ chức sẽ hiện ô chọn *Địa chỉ mạng dùng cho QR* — thử lần lượt từng địa chỉ.
4. **Router bật AP Isolation / Client Isolation** (hay gặp ở WiFi cửa hàng, showroom). Chế độ này chặn các thiết bị nhìn thấy nhau. Phải tắt trong trang quản trị router, hoặc phát WiFi từ điện thoại rồi cho laptop + người tham gia cùng nối vào điểm phát đó.
5. Kiểm tra nhanh: mở trình duyệt trên điện thoại, gõ đúng địa chỉ IP hiện trên màn hình. Nếu vẫn không ra, vấn đề nằm ở mạng chứ không phải app.

### Các sự cố khác

| Vấn đề | Cách xử lý |
|---|---|
| Máy chủ báo cổng 3000 đang bận | Đóng ứng dụng đang chiếm cổng, hoặc chạy `PORT=3001 node server.js` |
| Muốn đổi mã PIN | Bấm **▶ Bắt đầu tổ chức** lại — mỗi lần tạo phòng mới sinh PIN mới |
| Trùng tên | Hệ thống chặn tên trùng trong cùng phòng, người sau phải đổi tên |
| Mời một người ra khỏi phòng | Bấm dấu **×** cạnh tên trong danh sách chờ |

---

## 8. Cấu trúc thư mục

```
live-quiz/
├── server.js               Máy chủ (game engine, WebSocket, xuất Excel)
├── package.json
├── START-WINDOWS.bat       Chạy trên Windows
├── START-MAC-LINUX.sh      Chạy trên Mac/Linux
├── mau-bo-de-vi-du.json    Bộ đề mẫu để nhập thử
├── public/
│   ├── index.html          Màn hình người tổ chức
│   ├── play.html           Màn hình người tham gia
│   ├── style.css
│   └── i18n.js             Từ điển song ngữ Việt–Anh
└── data/
    ├── quizzes.json        Các bộ đề đã lưu
    └── results/            Kết quả từng buổi thi (JSON)
```

Nút **EN/VI** ở góc phải trên chuyển đổi ngôn ngữ giao diện bất cứ lúc nào.
