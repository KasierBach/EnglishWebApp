from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
import sqlite3
import hashlib
import jwt
import datetime
from functools import wraps
import os

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'your-super-secret-key-here')
CORS(app)

# Database Models (OOP approach)
class Database:
    def __init__(self, db_name='english_app.db'):
        self.db_name = os.path.join(os.getcwd(), db_name)
        self.init_database()
    
    def get_connection(self):
        return sqlite3.connect(self.db_name)
    
    def init_database(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Topics table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS topics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                level TEXT NOT NULL,
                description TEXT
            )
        ''')
        
        # Vocabularies table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS vocabularies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word TEXT NOT NULL,
                meaning TEXT NOT NULL,
                example TEXT,
                pronunciation TEXT,
                topic_id INTEGER,
                FOREIGN KEY (topic_id) REFERENCES topics (id)
            )
        ''')
        
        # Progress table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                vocab_id INTEGER,
                status TEXT DEFAULT 'not_learned',
                score INTEGER DEFAULT 0,
                last_reviewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (vocab_id) REFERENCES vocabularies (id)
            )
        ''')
        
        # Quizzes table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS quizzes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic_id INTEGER,
                question TEXT NOT NULL,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                option_c TEXT NOT NULL,
                option_d TEXT NOT NULL,
                correct_answer TEXT NOT NULL,
                FOREIGN KEY (topic_id) REFERENCES topics (id)
            )
        ''')
        
        # Results table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                quiz_id INTEGER,
                score REAL,
                total_questions INTEGER,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        
        # Insert sample data
        self.insert_sample_data()
    
    def insert_sample_data(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Check if data already exists
        cursor.execute("SELECT COUNT(*) FROM topics")
        if cursor.fetchone()[0] > 0:
            conn.close()
            return
        
        # Sample topics với tiếng Việt
        topics = [
            ('Gia đình', 'A1', 'Từ vựng cơ bản về gia đình'),
            ('Du lịch', 'A2', 'Từ vựng liên quan đến du lịch'),
            ('Kinh doanh', 'B1', 'Từ vựng tiếng Anh thương mại'),
            ('Công nghệ', 'B2', 'Thuật ngữ công nghệ thông tin'),
            ('Đồ ăn', 'A2', 'Từ vựng về thức ăn và đồ uống'),
            ('Sức khỏe', 'B1', 'Từ vựng y tế và sức khỏe'),
            ('Giáo dục', 'B1', 'Từ vựng về giáo dục và học tập'),
            ('Thể thao', 'A2', 'Từ vựng về các môn thể thao')
        ]
        
        cursor.executemany("INSERT INTO topics (name, level, description) VALUES (?, ?, ?)", topics)
        
        # Sample vocabularies với nhiều từ vựng tiếng Việt hơn
        vocabularies = [
            # Gia đình (Family)
            ('father', 'bố, cha', 'My father is a teacher.', '/ˈfɑːðər/', 1),
            ('mother', 'mẹ', 'My mother cooks delicious food.', '/ˈmʌðər/', 1),
            ('brother', 'anh trai, em trai', 'I have one brother.', '/ˈbrʌðər/', 1),
            ('sister', 'chị gái, em gái', 'My sister is younger than me.', '/ˈsɪstər/', 1),
            ('grandfather', 'ông nội, ông ngoại', 'My grandfather tells great stories.', '/ˈɡrænfɑːðər/', 1),
            ('grandmother', 'bà nội, bà ngoại', 'Grandmother makes the best cookies.', '/ˈɡrænmʌðər/', 1),
            ('uncle', 'chú, bác, cậu', 'My uncle lives in Canada.', '/ˈʌŋkəl/', 1),
            ('aunt', 'cô, dì, thím', 'Aunt Mary is coming for dinner.', '/ænt/', 1),
            ('cousin', 'anh em họ', 'My cousin and I are the same age.', '/ˈkʌzən/', 1),
            ('parents', 'bố mẹ', 'My parents are very supportive.', '/ˈperənts/', 1),
            
            # Du lịch (Travel)
            ('airport', 'sân bay', 'We arrived at the airport early.', '/ˈeərpɔːrt/', 2),
            ('hotel', 'khách sạn', 'The hotel was very comfortable.', '/hoʊˈtel/', 2),
            ('passport', 'hộ chiếu', 'Don\'t forget your passport.', '/ˈpæspɔːrt/', 2),
            ('ticket', 'vé', 'I bought a plane ticket online.', '/ˈtɪkɪt/', 2),
            ('luggage', 'hành lý', 'My luggage is too heavy.', '/ˈlʌɡɪdʒ/', 2),
            ('vacation', 'kỳ nghỉ', 'We had a wonderful vacation.', '/veɪˈkeɪʃən/', 2),
            ('tourist', 'khách du lịch', 'The city is full of tourists.', '/ˈtʊrɪst/', 2),
            ('guide', 'hướng dẫn viên', 'Our tour guide was very knowledgeable.', '/ɡaɪd/', 2),
            ('map', 'bản đồ', 'I need a map of the city.', '/mæp/', 2),
            ('restaurant', 'nhà hàng', 'Let\'s try that new restaurant.', '/ˈrestərɑːnt/', 2),
            
            # Kinh doanh (Business)
            ('meeting', 'cuộc họp', 'We have a meeting at 3 PM.', '/ˈmiːtɪŋ/', 3),
            ('office', 'văn phòng', 'I work in a modern office.', '/ˈɔːfɪs/', 3),
            ('manager', 'quản lý', 'The manager approved my request.', '/ˈmænɪdʒər/', 3),
            ('employee', 'nhân viên', 'Every employee gets health insurance.', '/ɪmˈplɔːiː/', 3),
            ('salary', 'lương', 'My salary increased this year.', '/ˈsæləri/', 3),
            ('contract', 'hợp đồng', 'Please sign the contract.', '/ˈkɑːntrækt/', 3),
            ('client', 'khách hàng', 'We need to satisfy our clients.', '/ˈklaɪənt/', 3),
            ('project', 'dự án', 'This project will take six months.', '/ˈprɑːdʒekt/', 3),
            ('deadline', 'hạn chót', 'The deadline is next Friday.', '/ˈdedlaɪn/', 3),
            ('presentation', 'bài thuyết trình', 'I have to give a presentation tomorrow.', '/ˌpriːzenˈteɪʃən/', 3),
            
            # Công nghệ (Technology)
            ('computer', 'máy tính', 'I use my computer every day.', '/kəmˈpjuːtər/', 4),
            ('internet', 'mạng internet', 'The internet connection is slow.', '/ˈɪntərnet/', 4),
            ('website', 'trang web', 'This website is very useful.', '/ˈwebsaɪt/', 4),
            ('software', 'phần mềm', 'We need to update the software.', '/ˈsɔːftwer/', 4),
            ('smartphone', 'điện thoại thông minh', 'My smartphone has many apps.', '/ˈsmɑːrtfoʊn/', 4),
            ('application', 'ứng dụng', 'Download this application.', '/ˌæplɪˈkeɪʃən/', 4),
            ('password', 'mật khẩu', 'Create a strong password.', '/ˈpæswərd/', 4),
            ('email', 'thư điện tử', 'Send me an email later.', '/ˈiːmeɪl/', 4),
            ('database', 'cơ sở dữ liệu', 'The database contains customer information.', '/ˈdeɪtəbeɪs/', 4),
            ('programming', 'lập trình', 'Programming requires logical thinking.', '/ˈproʊɡræmɪŋ/', 4),
            
            # Đồ ăn (Food)
            ('breakfast', 'bữa sáng', 'I have breakfast at 7 AM.', '/ˈbrekfəst/', 5),
            ('lunch', 'bữa trưa', 'Let\'s have lunch together.', '/lʌntʃ/', 5),
            ('dinner', 'bữa tối', 'Dinner is ready!', '/ˈdɪnər/', 5),
            ('rice', 'cơm, gạo', 'Rice is a staple food in Vietnam.', '/raɪs/', 5),
            ('bread', 'bánh mì', 'I bought fresh bread this morning.', '/bred/', 5),
            ('fruit', 'trái cây', 'Eat more fruit for vitamins.', '/fruːt/', 5),
            ('vegetable', 'rau củ', 'Vegetables are good for health.', '/ˈvedʒtəbəl/', 5),
            ('meat', 'thịt', 'This meat is very tender.', '/miːt/', 5),
            ('fish', 'cá', 'Fish is rich in protein.', '/fɪʃ/', 5),
            ('water', 'nước', 'Drink plenty of water daily.', '/ˈwɔːtər/', 5),
            
            # Sức khỏe (Health)
            ('doctor', 'bác sĩ', 'I need to see a doctor.', '/ˈdɑːktər/', 6),
            ('hospital', 'bệnh viện', 'The hospital is nearby.', '/ˈhɑːspɪtəl/', 6),
            ('medicine', 'thuốc', 'Take this medicine twice a day.', '/ˈmedɪsən/', 6),
            ('healthy', 'khỏe mạnh', 'Exercise keeps you healthy.', '/ˈhelθi/', 6),
            ('sick', 'ốm, bệnh', 'I feel sick today.', '/sɪk/', 6),
            ('pain', 'đau', 'I have a pain in my back.', '/peɪn/', 6),
            ('fever', 'sốt', 'The child has a high fever.', '/ˈfiːvər/', 6),
            ('headache', 'đau đầu', 'I have a terrible headache.', '/ˈhedeɪk/', 6),
            ('exercise', 'tập thể dục', 'Exercise is important for health.', '/ˈeksərsaɪz/', 6),
            ('vitamin', 'vitamin', 'Vitamin C boosts immunity.', '/ˈvaɪtəmɪn/', 6),
            
            # Giáo dục (Education)
            ('school', 'trường học', 'My school is very big.', '/skuːl/', 7),
            ('teacher', 'giáo viên', 'The teacher explains very well.', '/ˈtiːtʃər/', 7),
            ('student', 'học sinh, sinh viên', 'Every student should study hard.', '/ˈstuːdənt/', 7),
            ('book', 'sách', 'This book is very interesting.', '/bʊk/', 7),
            ('lesson', 'bài học', 'Today\'s lesson is about grammar.', '/ˈlesən/', 7),
            ('homework', 'bài tập về nhà', 'I finished my homework early.', '/ˈhoʊmwɜːrk/', 7),
            ('exam', 'kỳ thi', 'The exam is next week.', '/ɪɡˈzæm/', 7),
            ('grade', 'điểm số', 'I got a good grade on the test.', '/ɡreɪd/', 7),
            ('library', 'thư viện', 'I study in the library.', '/ˈlaɪbreri/', 7),
            ('knowledge', 'kiến thức', 'Knowledge is power.', '/ˈnɑːlɪdʒ/', 7),
            
            # Thể thao (Sports)
            ('football', 'bóng đá', 'Football is popular worldwide.', '/ˈfʊtbɔːl/', 8),
            ('basketball', 'bóng rổ', 'He plays basketball every weekend.', '/ˈbæskɪtbɔːl/', 8),
            ('swimming', 'bơi lội', 'Swimming is great exercise.', '/ˈswɪmɪŋ/', 8),
            ('running', 'chạy bộ', 'I go running every morning.', '/ˈrʌnɪŋ/', 8),
            ('tennis', 'quần vợt', 'Tennis requires good coordination.', '/ˈtenɪs/', 8),
            ('volleyball', 'bóng chuyền', 'Our team won the volleyball match.', '/ˈvɑːlibɔːl/', 8),
            ('badminton', 'cầu lông', 'Badminton is popular in Asia.', '/ˈbædmɪntən/', 8),
            ('cycling', 'đạp xe', 'Cycling is environmentally friendly.', '/ˈsaɪklɪŋ/', 8),
            ('gym', 'phòng tập gym', 'I work out at the gym.', '/dʒɪm/', 8),
            ('team', 'đội, nhóm', 'Our team practices every day.', '/tiːm/', 8)
        ]
        
        cursor.executemany("INSERT INTO vocabularies (word, meaning, example, pronunciation, topic_id) VALUES (?, ?, ?, ?, ?)", vocabularies)
        
        # Sample quizzes với câu hỏi tiếng Việt
        quizzes = [
            # Gia đình
            (1, 'Từ "father" có nghĩa là gì?', 'bố, cha', 'mẹ', 'anh trai', 'chị gái', 'A'),
            (1, 'Từ "sister" có nghĩa là gì?', 'bố', 'mẹ', 'anh trai', 'chị gái, em gái', 'D'),
            (1, 'Từ "grandfather" có nghĩa là gì?', 'ông nội, ông ngoại', 'bà nội, bà ngoại', 'chú, bác', 'cô, dì', 'A'),
            
            # Du lịch
            (2, 'Từ "airport" có nghĩa là gì?', 'khách sạn', 'sân bay', 'hộ chiếu', 'máy bay', 'B'),
            (2, 'Từ "hotel" có nghĩa là gì?', 'sân bay', 'khách sạn', 'nhà hàng', 'bản đồ', 'B'),
            (2, 'Từ "passport" có nghĩa là gì?', 'vé máy bay', 'hành lý', 'hộ chiếu', 'bản đồ', 'C'),
            
            # Kinh doanh
            (3, 'Từ "meeting" có nghĩa là gì?', 'cuộc họp', 'văn phòng', 'công ty', 'nhân viên', 'A'),
            (3, 'Từ "manager" có nghĩa là gì?', 'nhân viên', 'quản lý', 'khách hàng', 'dự án', 'B'),
            (3, 'Từ "salary" có nghĩa là gì?', 'hợp đồng', 'lương', 'dự án', 'hạn chót', 'B'),
            
            # Công nghệ
            (4, 'Từ "computer" có nghĩa là gì?', 'điện thoại', 'máy tính', 'internet', 'phần mềm', 'B'),
            (4, 'Từ "internet" có nghĩa là gì?', 'máy tính', 'mạng internet', 'trang web', 'ứng dụng', 'B'),
            (4, 'Từ "smartphone" có nghĩa là gì?', 'máy tính', 'điện thoại thông minh', 'phần mềm', 'mật khẩu', 'B'),
            
            # Đồ ăn
            (5, 'Từ "breakfast" có nghĩa là gì?', 'bữa sáng', 'bữa trưa', 'bữa tối', 'đồ ăn nhẹ', 'A'),
            (5, 'Từ "rice" có nghĩa là gì?', 'bánh mì', 'cơm, gạo', 'trái cây', 'rau củ', 'B'),
            (5, 'Từ "fruit" có nghĩa là gì?', 'rau củ', 'thịt', 'trái cây', 'cá', 'C'),
            
            # Sức khỏe
            (6, 'Từ "doctor" có nghĩa là gì?', 'bác sĩ', 'bệnh viện', 'thuốc', 'bệnh nhân', 'A'),
            (6, 'Từ "medicine" có nghĩa là gì?', 'bác sĩ', 'bệnh viện', 'thuốc', 'sức khỏe', 'C'),
            (6, 'Từ "healthy" có nghĩa là gì?', 'ốm', 'khỏe mạnh', 'đau', 'sốt', 'B'),
            
            # Giáo dục
            (7, 'Từ "school" có nghĩa là gì?', 'trường học', 'giáo viên', 'học sinh', 'sách', 'A'),
            (7, 'Từ "teacher" có nghĩa là gì?', 'học sinh', 'giáo viên', 'sách', 'bài học', 'B'),
            (7, 'Từ "homework" có nghĩa là gì?', 'bài học', 'kỳ thi', 'bài tập về nhà', 'thư viện', 'C'),
            
            # Thể thao
            (8, 'Từ "football" có nghĩa là gì?', 'bóng đá', 'bóng rổ', 'bơi lội', 'chạy bộ', 'A'),
            (8, 'Từ "swimming" có nghĩa là gì?', 'chạy bộ', 'quần vợt', 'bơi lội', 'đạp xe', 'C'),
            (8, 'Từ "gym" có nghĩa là gì?', 'đội nhóm', 'phòng tập gym', 'sân vận động', 'huấn luyện viên', 'B')
        ]
        
        cursor.executemany("INSERT INTO quizzes (topic_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)", quizzes)
        
        # Create admin user
        admin_password = hashlib.sha256('admin123'.encode()).hexdigest()
        cursor.execute("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", 
                      ('admin', 'admin@example.com', admin_password, 'admin'))
        
        conn.commit()
        conn.close()

class User:
    def __init__(self, db):
        self.db = db
    
    def register(self, username, email, password):
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                          (username, email, hashed_password))
            conn.commit()
            user_id = cursor.lastrowid
            conn.close()
            return {'success': True, 'user_id': user_id}
        except sqlite3.IntegrityError:
            conn.close()
            return {'success': False, 'message': 'Tên đăng nhập hoặc email đã tồn tại'}
    
    def login(self, username, password):
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        cursor.execute("SELECT id, username, email, role FROM users WHERE username = ? AND password = ?",
                      (username, hashed_password))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            token = jwt.encode({
                'user_id': user[0],
                'username': user[1],
                'role': user[3],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, app.secret_key, algorithm='HS256')
            
            return {
                'success': True,
                'token': token,
                'user': {
                    'id': user[0],
                    'username': user[1],
                    'email': user[2],
                    'role': user[3]
                }
            }
        return {'success': False, 'message': 'Tên đăng nhập hoặc mật khẩu không đúng'}

class Topic:
    def __init__(self, db):
        self.db = db
    
    def get_all(self):
        conn = self.db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM topics")
        topics = cursor.fetchall()
        conn.close()
        
        return [{'id': t[0], 'name': t[1], 'level': t[2], 'description': t[3]} for t in topics]
    
    def get_by_id(self, topic_id):
        conn = self.db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM topics WHERE id = ?", (topic_id,))
        topic = cursor.fetchone()
        conn.close()
        
        if topic:
            return {'id': topic[0], 'name': topic[1], 'level': topic[2], 'description': topic[3]}
        return None

class Vocabulary:
    def __init__(self, db):
        self.db = db
    
    def get_by_topic(self, topic_id):
        conn = self.db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM vocabularies WHERE topic_id = ?", (topic_id,))
        vocabularies = cursor.fetchall()
        conn.close()
        
        return [{
            'id': v[0],
            'word': v[1],
            'meaning': v[2],
            'example': v[3],
            'pronunciation': v[4],
            'topic_id': v[5]
        } for v in vocabularies]

class Quiz:
    def __init__(self, db):
        self.db = db
    
    def get_by_topic(self, topic_id):
        conn = self.db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM quizzes WHERE topic_id = ?", (topic_id,))
        quizzes = cursor.fetchall()
        conn.close()
        
        return [{
            'id': q[0],
            'topic_id': q[1],
            'question': q[2],
            'options': {
                'A': q[3],
                'B': q[4],
                'C': q[5],
                'D': q[6]
            },
            'correct_answer': q[7]
        } for q in quizzes]
    
    def submit_result(self, user_id, quiz_results):
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        total_questions = len(quiz_results)
        correct_answers = sum(1 for result in quiz_results if result['is_correct'])
        score = (correct_answers / total_questions) * 100
        
        quiz_id_to_save = quiz_results[0]['quiz_id'] if quiz_results else 0
        
        cursor.execute("INSERT INTO results (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)",
                      (user_id, quiz_id_to_save, score, total_questions))
        
        conn.commit()
        conn.close()
        
        return {'score': score, 'correct': correct_answers, 'total': total_questions}

# Initialize database and models
db = Database()
user_model = User(db)
topic_model = Topic(db)
vocabulary_model = Vocabulary(db)
quiz_model = Quiz(db)

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Thiếu token xác thực'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.secret_key, algorithms=['HS256'])
            current_user = data
        except:
            return jsonify({'message': 'Token không hợp lệ'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    result = user_model.register(data['username'], data['email'], data['password'])
    return jsonify(result)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    result = user_model.login(data['username'], data['password'])
    return jsonify(result)

@app.route('/api/topics', methods=['GET'])
def get_topics():
    topics = topic_model.get_all()
    return jsonify(topics)

@app.route('/api/topics/<int:topic_id>/vocabularies', methods=['GET'])
def get_vocabularies(topic_id):
    vocabularies = vocabulary_model.get_by_topic(topic_id)
    return jsonify(vocabularies)

@app.route('/api/topics/<int:topic_id>/quiz', methods=['GET'])
def get_quiz(topic_id):
    quiz_questions = quiz_model.get_by_topic(topic_id)
    return jsonify(quiz_questions)

@app.route('/api/quiz/submit', methods=['POST'])
@token_required
def submit_quiz(current_user):
    data = request.get_json()
    result = quiz_model.submit_result(current_user['user_id'], data['results'])
    return jsonify(result)

@app.route('/api/progress', methods=['GET'])
@token_required
def get_progress(current_user):
    conn = db.get_connection()
    cursor = conn.cursor()
    
    # Get user's learning statistics
    cursor.execute("""
        SELECT 
            COUNT(DISTINCT p.vocab_id) as learned_words,
            AVG(r.score) as avg_score,
            COUNT(DISTINCT r.id) as quizzes_taken
        FROM progress p
        LEFT JOIN results r ON r.user_id = p.user_id
        WHERE p.user_id = ?
    """, (current_user['user_id'],))
    
    stats = cursor.fetchone()
    conn.close()
    
    return jsonify({
        'learned_words': stats[0] or 0,
        'average_score': round(stats[1] or 0, 2),
        'quizzes_taken': stats[2] or 0
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
