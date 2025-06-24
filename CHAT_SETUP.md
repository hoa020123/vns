# Hướng dẫn cấu hình AI Chat với Digital Ocean

## 🎮 Chat Demo

Trước khi cấu hình kết nối thực, bạn có thể test giao diện chat bằng cách:

1. Chọn tab **"🎮 Chat Demo"** trong ứng dụng
2. Test các tính năng:
   - Gửi tin nhắn và nhận phản hồi demo
   - Kiểm tra kết nối demo
   - Xuất lịch sử chat
   - Xóa lịch sử chat
   - Responsive design

## 🤖 AI Chat Thực

Để kết nối với AI Agent thực trên Digital Ocean:

### Bước 1: Tạo file .env.local

Tạo file `.env.local` trong thư mục gốc của dự án với nội dung sau:

```env
# Cấu hình AI Agent API
# Thay thế các giá trị bên dưới bằng thông tin thực từ Digital Ocean AI Agent của bạn

# API Endpoint của AI Agent trên Digital Ocean
REACT_APP_AI_API_ENDPOINT=https://your-digitalocean-ai-agent.com/api/chat

# API Key để xác thực với AI Agent
REACT_APP_AI_API_KEY=your_api_key_here
```

### Bước 2: Cấu hình API Endpoint

Thay thế `https://your-digitalocean-ai-agent.com/api/chat` bằng URL thực của AI Agent của bạn trên Digital Ocean.

Ví dụ:
```env
REACT_APP_AI_API_ENDPOINT=https://ai-agent-123.digitaloceanspaces.com/chat
```

### Bước 3: Cấu hình API Key

Thay thế `your_api_key_here` bằng API key thực của bạn.

Ví dụ:
```env
REACT_APP_AI_API_KEY=sk-1234567890abcdef
```

### Bước 4: Khởi động ứng dụng

Sau khi cấu hình xong, khởi động lại ứng dụng:

```bash
npm start
```

### Bước 5: Sử dụng Chat

1. Mở ứng dụng và chọn tab "🤖 AI Chat"
2. Nhấn nút "⚪ Chưa kết nối" để kiểm tra kết nối
3. Nếu kết nối thành công, nút sẽ chuyển thành "🟢 Đã kết nối"
4. Bắt đầu chat với AI Agent!

## Tính năng của Chat Component

### ✅ Đã hoàn thành:
- **Giao diện chat hiện đại và responsive**
- **Kết nối với AI Agent qua API**
- **Hiển thị trạng thái kết nối** (idle, connecting, connected, error)
- **Gửi và nhận tin nhắn**
- **Hiển thị thời gian tin nhắn**
- **Animation typing indicator**
- **Lưu lịch sử chat vào localStorage**
- **Xuất lịch sử chat ra file JSON**
- **Xóa lịch sử chat với xác nhận**
- **Hỗ trợ Enter để gửi, Shift+Enter để xuống dòng**
- **Cấu hình API endpoint và key qua environment variables**
- **Demo mode để test giao diện**

### 🔧 Cấu hình API:

Component Chat hỗ trợ các endpoint API sau:

1. **Health Check**: `${apiEndpoint}/health` - Kiểm tra trạng thái kết nối
2. **Chat**: `${apiEndpoint}` - Gửi tin nhắn và nhận phản hồi

### 📝 Format tin nhắn gửi đi:

```json
{
  "message": "Nội dung tin nhắn của bạn",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 📝 Format phản hồi mong đợi:

```json
{
  "response": "Phản hồi từ AI Agent",
  "message": "Phản hồi từ AI Agent (alternative field)"
}
```

## Xử lý lỗi

Component sẽ hiển thị thông báo lỗi trong các trường hợp:
- Không thể kết nối với AI Agent
- API key không hợp lệ
- Lỗi mạng
- Lỗi server

## Bảo mật

- API key được lưu trong environment variables
- Không hiển thị API key trong giao diện
- Sử dụng HTTPS cho kết nối API
- Xác thực qua Bearer token

## Tùy chỉnh

Bạn có thể tùy chỉnh component Chat bằng cách:

1. Thay đổi CSS trong file `Chat.css`
2. Sửa đổi logic trong file `Chat.tsx`
3. Thêm các tính năng mới như file upload, voice chat, etc.

## Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. API endpoint có đúng không
2. API key có hợp lệ không
3. AI Agent có đang hoạt động không
4. CORS có được cấu hình đúng không

## 🎯 Workflow đề xuất:

1. **Test Demo**: Sử dụng "🎮 Chat Demo" để làm quen với giao diện
2. **Cấu hình**: Tạo file `.env.local` với thông tin AI Agent
3. **Test kết nối**: Sử dụng "🤖 AI Chat" để test kết nối thực
4. **Sử dụng**: Bắt đầu chat với AI Agent của bạn! 