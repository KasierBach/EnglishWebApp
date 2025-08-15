# 🎓 English Learning App - Ứng Dụng Học Tiếng Anh

Một ứng dụng học tiếng Anh tương tác với nhiều chế độ học tập khác nhau, được xây dựng bằng Next.js và Python Flask.

## ✨ Tính Năng Chính

### 🎯 Các Chế độ Học Tập
- **Flashcards**: Học từ vựng với thẻ ghi nhớ có hiệu ứng lật
- **Matching Game**: Trò chơi ghép cặp từ tiếng Anh với nghĩa tiếng Việt
- **Writing Practice**: Luyện viết từ vựng với phản hồi tức thì
- **Quiz System**: Hệ thống trắc nghiệm đa lựa chọn với tính điểm
- **Listening/Speaking**: Tính năng nghe và nói (đang phát triển)

### 🏆 Hệ Thống Gamification
- Hệ thống thành tích với theo dõi tiến độ
- Chuỗi học tập hàng ngày và mục tiêu
- Theo dõi điểm số và độ chính xác
- Trực quan hóa tiến độ với biểu đồ

### 📚 Nội Dung Học Tập
- **8 chủ đề**: Family, Travel, Business, Technology, Food, Health, Education, Sports
- **80+ từ vựng** với bản dịch tiếng Việt
- **Câu ví dụ** và phiên âm
- **24+ câu hỏi quiz** trên tất cả chủ đề
- **Cấp độ khác nhau**: A1-B2

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **Next.js 14** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library

### Backend
- **Python Flask** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **CORS** - Cross-origin support

## 🚀 Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- Node.js 18+
- Python 3.8+
- npm hoặc yarn

### Frontend (Next.js)
\`\`\`bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
npm start
\`\`\`

### Backend (Python Flask)
\`\`\`bash
# Cài đặt Python dependencies
pip install -r requirements.txt

# Chạy Flask server
python app.py
\`\`\`

### Deployment (Heroku)
Ứng dụng đã được cấu hình sẵn cho Heroku với `Procfile`:
\`\`\`bash
# Deploy lên Heroku
git push heroku main
\`\`\`

## 📁 Cấu Trúc Dự Án

\`\`\`
├── app/                          # Frontend Next.js
│   ├── components/              # React components
│   │   ├── Dashboard.tsx        # Trang chính
│   │   ├── QuizSection.tsx      # Hệ thống quiz
│   │   ├── MatchingGame.tsx     # Trò chơi ghép cặp
│   │   ├── VocabularySection.tsx # Học từ vựng
│   │   ├── WritingPractice.tsx  # Luyện viết
│   │   ├── StatisticsPanel.tsx  # Thống kê
│   │   ├── AchievementBadges.tsx # Hệ thống thành tích
│   │   └── AuthSection.tsx      # Đăng nhập/đăng ký
│   ├── types/                   # TypeScript types
│   ├── utils/                   # Utilities và translations
│   └── page.tsx                 # Trang chủ
├── app.py                       # Flask backend server
├── requirements.txt             # Python dependencies
├── Procfile                     # Heroku deployment config
└── package.json                 # Node.js dependencies
\`\`\`

## 🎮 Cách Sử Dụng

### 1. Đăng Ký/Đăng Nhập
- Tạo tài khoản mới hoặc đăng nhập với tài khoản có sẵn
- Hệ thống sử dụng JWT để xác thực người dùng

### 2. Chọn Chủ Đề
- Chọn một trong 8 chủ đề học tập
- Mỗi chủ đề có các cấp độ khác nhau (A1-B2)

### 3. Chọn Chế Độ Học
- **Flashcards**: Học từ vựng cơ bản
- **Matching**: Trò chơi ghép cặp 6 từ
- **Writing**: Luyện viết từ vựng
- **Quiz**: Kiểm tra kiến thức

### 4. Theo Dõi Tiến Độ
- Xem thống kê học tập hàng ngày/tuần
- Theo dõi chuỗi học tập
- Mở khóa các thành tích mới

## 🌐 API Endpoints

### Authentication
- `POST /register` - Đăng ký tài khoản mới
- `POST /login` - Đăng nhập

### Learning Content
- `GET /topics` - Lấy danh sách chủ đề
- `GET /vocabularies/<topic_id>` - Lấy từ vựng theo chủ đề
- `GET /quizzes/<topic_id>` - Lấy câu hỏi quiz

### Progress Tracking
- `POST /progress` - Lưu tiến độ học tập
- `GET /results/<user_id>` - Lấy kết quả học tập

## 🎨 Giao Diện

- **Responsive Design**: Tương thích với mọi thiết bị
- **Dark/Light Mode**: Chuyển đổi chế độ sáng/tối
- **Đa Ngôn Ngữ**: Hỗ trợ tiếng Việt và tiếng Anh
- **Animations**: Hiệu ứng mượt mà và tương tác

## 🔧 Cấu Hình

### Environment Variables
\`\`\`bash
# Backend
DATABASE_URL=sqlite:///english_app.db
JWT_SECRET_KEY=your-secret-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

## 📈 Tính Năng Sắp Tới

- [ ] Tính năng nghe và phát âm
- [ ] Học tập với AI
- [ ] Chế độ học nhóm
- [ ] Thêm nhiều ngôn ngữ
- [ ] Mobile app (React Native)
- [ ] Tích hợp với Google Translate API

## 🤝 Đóng Góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 👥 Tác Giả

- **Developer**: [Tên của bạn]
- **Email**: [email@example.com]
- **GitHub**: [github.com/username]

## 🙏 Cảm Ơn

- Cảm ơn cộng đồng Next.js và Flask
- Icons từ Lucide React
- UI components từ Tailwind CSS

---

**Happy Learning! 🎉 Chúc bạn học tốt!**
