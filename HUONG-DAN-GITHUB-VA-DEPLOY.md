# Đưa app lên GitHub rồi chạy online (Render.com)

Toàn bộ quá trình khoảng 10 phút, không cần cài phần mềm gì.

---

## PHẦN 1 — Đưa code lên GitHub (2 phút)

1. Giải nén file zip. Bạn sẽ thấy thư mục `live-quiz` chứa: `server.js`, `package.json`, `render.yaml`, thư mục `public`, thư mục `data`…

2. **Mở đúng thư mục `live-quiz`** rồi bôi đen **toàn bộ** những gì bên trong (Ctrl+A). Lưu ý: kéo *nội dung bên trong*, không kéo cả thư mục `live-quiz` — nếu kéo cả thư mục, Render sẽ không tìm thấy `package.json`.

3. Mở repo bạn vừa tạo trên github.com. Nếu repo còn trống, bấm dòng **uploading an existing file**. Nếu repo đã có file, bấm **Add file → Upload files**.

4. **Kéo thả** toàn bộ file và thư mục vừa bôi đen vào khung giữa trang. Đợi thanh tiến trình chạy xong (thư mục `public` sẽ tự lên theo).

5. Kéo xuống cuối trang, ô *Commit changes* gõ `phien ban dau tien`, bấm nút xanh **Commit changes**.

Xong. Trang repo phải nhìn thấy `server.js`, `package.json`, `render.yaml` và thư mục `public` **ngay ở cấp ngoài cùng**. Nếu chúng nằm lồng trong một thư mục `live-quiz` nữa thì bạn đã kéo nhầm ở bước 2 — mở thư mục đó ra, xoá đi và làm lại.

> **Không cần kéo thư mục `node_modules`** (nếu có). Nó rất nặng và Render sẽ tự cài lại.

---

## PHẦN 2 — Deploy lên Render.com (5 phút)

1. Vào https://render.com → **Get Started** → đăng nhập bằng chính tài khoản GitHub.

2. Bấm **New +** (góc trên bên phải) → chọn **Web Service**.

3. Chọn **Build and deploy from a Git repository** → **Next** → tìm repo vừa tạo → bấm **Connect**.
   Nếu không thấy repo: bấm **Configure account** để cấp quyền cho Render đọc repo đó.

4. Điền các ô:

   | Ô | Điền |
   |---|---|
   | Name | `live-quiz` (hoặc tên bạn thích — sẽ thành địa chỉ web) |
   | Region | **Singapore** (gần Việt Nam nhất, chạy nhanh nhất) |
   | Branch | `main` |
   | Root Directory | *để trống* |
   | Runtime | `Node` |
   | Build Command | `npm install` |
   | Start Command | `node server.js` |
   | Instance Type | **Free** |

5. Bấm **Create Web Service**. Đợi 2–3 phút, khi thấy chữ **Live** màu xanh là xong.

6. Địa chỉ web của bạn nằm ở đầu trang, dạng `https://live-quiz-xxxx.onrender.com`

Mở địa chỉ đó → soạn đề, tổ chức thi như bình thường. Mã QR sẽ tự trỏ vào địa chỉ này, nhân viên ở **bất kỳ đâu, bất kỳ mạng nào** cũng quét vào được — không còn phụ thuộc WiFi công ty.

---

## PHẦN 3 — Ba điều cần biết khi chạy trên Render bản Free

**1. Máy chủ "ngủ" sau 15 phút không ai dùng.**
Lần truy cập kế tiếp sẽ mất 30–60 giây để thức dậy. Trước mỗi buổi thi, bạn mở địa chỉ web trước khoảng 2 phút cho nó khởi động sẵn.

**2. Kết quả và bộ đề có thể bị mất khi Render khởi động lại.**
Bản Free không có ổ đĩa lưu lâu dài. Vì vậy:
- **Tải file Excel ngay sau mỗi buổi thi** — đừng để hôm sau mới tải.
- Bộ đề soạn trên web nên bấm **Xuất bộ đề** lưu file `.json` về máy để dự phòng.
- Muốn lưu vĩnh viễn: nâng lên gói trả phí của Render và gắn thêm Disk vào đường dẫn `/opt/render/project/src/data`.

**3. Cập nhật code sau này.**
Sửa file trên GitHub (hoặc kéo thả file mới đè lên) → Render **tự động deploy lại** trong vài phút, không cần làm gì thêm.

---

## Vẫn muốn chạy trong mạng LAN?

Được — hai cách chạy song song, không xung đột. Cứ nhấp đúp `START-WINDOWS.bat` trên laptop như bình thường. Bản LAN chạy nhanh hơn và không lo máy chủ ngủ, chỉ cần mọi người chung WiFi.
