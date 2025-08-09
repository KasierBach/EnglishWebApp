import random
import sqlite3
from typing import List, Dict, Any
from flask import request, jsonify

class RandomDataGenerator:
    def __init__(self, db_connection):
        self.db = db_connection
    
    def get_random_vocabularies(self, topic_id: int = None, limit: int = 10) -> List[Dict]:
        """Get random vocabulary words"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM vocabularies"
        params = ()
        
        if topic_id:
            query += " WHERE topic_id = ?"
            params = (topic_id,)
        
        cursor.execute(query, params)
        all_vocab = cursor.fetchall()
        conn.close()
        
        if len(all_vocab) <= limit:
            selected = all_vocab
        else:
            selected = random.sample(all_vocab, limit)
        
        return [{
            'id': v[0],
            'word': v[1],
            'meaning': v[2],
            'example': v[3],
            'pronunciation': v[4],
            'topic_id': v[5]
        } for v in selected]
    
    def generate_random_quiz(self, topic_id: int = None, difficulty: str = None) -> List[Dict]:
        """Generate random quiz questions"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM quizzes"
        params = ()
        
        if topic_id:
            query += " WHERE topic_id = ?"
            params = (topic_id,)
        
        cursor.execute(query, params)
        all_quizzes = cursor.fetchall()
        conn.close()
        
        # Randomly select 5-10 questions
        num_questions = random.randint(5, 10)
        if len(all_quizzes) <= num_questions:
            selected = all_quizzes
        else:
            selected = random.sample(all_quizzes, num_questions)
        
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
        } for q in selected]
    
    def generate_random_matching_game(self, topic_id: int = None, pairs: int = 8) -> Dict[str, List]:
        """Generate random matching game pairs"""
        vocabularies = self.get_random_vocabularies(topic_id, pairs * 2)
        
        # Create word-meaning pairs
        pairs = []
        for vocab in vocabularies[:pairs]:
            pairs.append({
                'word': vocab['word'],
                'meaning': vocab['meaning'],
                'id': vocab['id']
            })
        
        # Shuffle both lists
        words = [p['word'] for p in pairs]
        meanings = [p['meaning'] for p in pairs]
        
        random.shuffle(words)
        random.shuffle(meanings)
        
        return {
            'words': words,
            'meanings': meanings,
            'correct_pairs': pairs
        }
    
    def generate_random_fill_in_blank(self, topic_id: int = None, questions: int = 5) -> List[Dict]:
        """Generate fill-in-the-blank questions"""
        vocabularies = self.get_random_vocabularies(topic_id, questions)
        
        fill_questions = []
        for vocab in vocabularies:
            # Create sentence with blank
            sentence = vocab['example']
            word = vocab['word']
            
            # Replace the word with blank
            blank_sentence = sentence.replace(word, '_____')
            
            fill_questions.append({
                'sentence': blank_sentence,
                'correct_word': word,
                'meaning': vocab['meaning'],
                'id': vocab['id']
            })
        
        return fill_questions
    
    def generate_random_word_scramble(self, topic_id: int = None, words: int = 8) -> List[Dict]:
        """Generate word scramble exercises"""
        vocabularies = self.get_random_vocabularies(topic_id, words)
        
        scrambles = []
        for vocab in vocabularies:
            word = vocab['word']
            # Scramble the word
            scrambled = list(word)
            random.shuffle(scrambled)
            scrambled_word = ''.join(scrambled)
            
            # Ensure scrambled is different from original
            while scrambled_word == word:
                random.shuffle(scrambled)
                scrambled_word = ''.join(scrambled)
            
            scrambles.append({
                'scrambled': scrambled_word,
                'correct_word': word,
                'meaning': vocab['meaning'],
                'id': vocab['id']
            })
        
        return scrambles

# Add new endpoints to app.py
def add_random_endpoints(app, db):
    generator = RandomDataGenerator(db)
    
    @app.route('/api/random/vocabularies', methods=['GET'])
    def get_random_vocabularies():
        topic_id = request.args.get('topic_id', type=int)
        limit = request.args.get('limit', 10, type=int)
        vocabularies = generator.get_random_vocabularies(topic_id, limit)
        return jsonify(vocabularies)
    
    @app.route('/api/random/quiz', methods=['GET'])
    def get_random_quiz():
        topic_id = request.args.get('topic_id', type=int)
        vocabularies = generator.generate_random_quiz(topic_id)
        return jsonify(vocabularies)
    
    @app.route('/api/random/matching', methods=['GET'])
    def get_random_matching():
        topic_id = request.args.get('topic_id', type=int)
        pairs = request.args.get('pairs', 8, type=int)
        game = generator.generate_random_matching_game(topic_id, pairs)
        return jsonify(game)
    
    @app.route('/api/random/fill-blank', methods=['GET'])
    def get_random_fill_blank():
        topic_id = request.args.get('topic_id', type=int)
        questions = request.args.get('questions', 5, type=int)
        questions_data = generator.generate_random_fill_in_blank(topic_id, questions)
        return jsonify(questions_data)
    
    @app.route('/api/random/scramble', methods=['GET'])
    def get_random_scramble():
        topic_id = request.args.get('topic_id', type=int)
        words = request.args.get('words', 8, type=int)
        scrambles = generator.generate_random_word_scramble(topic_id, words)
        return jsonify(scrambles)
