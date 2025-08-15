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

### Deployment
**Frontend**: Vercel  
**Backend**: Render  

Frontend được deploy trên Vercel với tự động deploy từ Git:
\`\`\`bash
# Deploy frontend lên Vercel
vercel --prod
\`\`\`

Backend được deploy trên Render với cấu hình từ repository.

## 📁 Cấu Trúc Dự Án

\`\`\`
EnglishWebApp/
├── app/                              # Frontend Next.js
│   ├── components/                   # React components
│   │   ├── AchievementBadges.tsx     # Hệ thống thành tích và huy hiệu
│   │   ├── AuthSection.tsx           # Đăng nhập/đăng ký
│   │   ├── Dashboard.tsx             # Trang chính sau khi đăng nhập
│   │   ├── LanguageToggle.tsx        # Chuyển đổi ngôn ngữ
│   │   ├── MatchingGame.tsx          # Trò chơi ghép cặp từ vựng
│   │   ├── QuizSection.tsx           # Hệ thống quiz trắc nghiệm
│   │   ├── StatisticsPanel.tsx       # Bảng thống kê tiến độ
│   │   ├── VocabularySection.tsx     # Học từ vựng với flashcards
│   │   └── WritingPractice.tsx       # Luyện viết từ vựng
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   ├── utils/
│   │   └── translations.ts           # Bản dịch đa ngôn ngữ
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Trang chủ
├── app.py                            # Flask backend server
├── random_generator.py               # Tạo dữ liệu ngẫu nhiên
├── requirements.txt                  # Python dependencies
├── Procfile                          # Heroku deployment config
├── package.json                      # Node.js dependencies
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS config
└── tsconfig.json                     # TypeScript config
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
