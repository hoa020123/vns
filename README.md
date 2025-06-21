# VNS Project

Dự án React với TypeScript được tạo với Create React App.

## Tính năng

- ⚛️ React 18 với Concurrent Features
- 📝 TypeScript cho type safety
- 🎨 CSS hiện đại với gradient và glassmorphism
- 📱 Responsive design
- ⚡ Web Vitals optimization
- 🔢 Bộ đếm tương tác
- 📝 Todo List với quản lý công việc
- 🌤️ Weather Widget với dữ liệu thời tiết
- 🧮 Calculator với giao diện iOS

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng ở chế độ development:
```bash
npm start
```

Ứng dụng sẽ mở tại [http://localhost:3000](http://localhost:3000).

## Scripts có sẵn

- `npm start` - Chạy ứng dụng ở chế độ development
- `npm run build` - Build ứng dụng cho production
- `npm test` - Chạy test suite
- `npm run eject` - Eject từ Create React App (không thể hoàn tác!)

## Cấu trúc dự án

```
vns/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── TodoList.tsx
│   │   ├── TodoList.css
│   │   ├── WeatherWidget.tsx
│   │   ├── WeatherWidget.css
│   │   ├── Calculator.tsx
│   │   └── Calculator.css
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   ├── index.css
│   └── reportWebVitals.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Components

### 🔢 Bộ đếm
- Tăng/giảm số đếm
- Reset về 0
- Giao diện đẹp với animation

### 📝 Todo List
- Thêm/xóa công việc
- Đánh dấu hoàn thành
- Thống kê số lượng công việc
- Responsive design

### 🌤️ Weather Widget
- Hiển thị nhiệt độ và điều kiện thời tiết
- Cập nhật tự động mỗi 30 giây
- Animation cho icon thời tiết
- Thông tin độ ẩm và tốc độ gió

### 🧮 Calculator
- Máy tính với giao diện iOS
- Các phép tính cơ bản (+, -, ×, ÷)
- Chức năng AC, ±, %
- Hiển thị biểu thức đang tính

## Học thêm

Để tìm hiểu thêm về React, hãy xem [React documentation](https://reactjs.org/). 