import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const questions = [
  'What is your favorite breed of cat, and why?',
  'How do you think cats communicate with their owners?',
  'Have you ever owned a cat? If so, what was their name and personality like?',
  'Why do you think cats love to sleep in small, cozy places?',
  'What’s the funniest or strangest behavior you’ve ever seen a cat do?',
  'Do you prefer cats or kittens, and what’s the reason for your preference?',
  'Why do you think cats are known for being independent animals?',
  'How do you think cats manage to land on their feet when they fall?',
  'What’s your favorite fact or myth about cats?',
  'How would you describe the relationship between humans and cats in three words?',
];

const Chatbot = () => {
  const [sessionId, setSessionId] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Yeni bir oturum başlat
    axios.post('http://localhost:5000/api/start-session')
    .then(response => {
      setSessionId(response.data.sessionId);
    })
    .catch(error => {
      console.error('Oturum başlatılamadı:', error);
      alert('Sunucuya bağlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    });
  
  }, []);

  const handleSend = () => {
    if (userAnswer.trim() === '') return;

    const question = questions[currentQuestionIndex];
    const answer = userAnswer;

    // Cevabı backend'e gönder ve kaydet
    axios.post('http://localhost:5000/api/answer', {
      sessionId,
      question,
      answer,
    })
      .then(response => {
        // Sohbet geçmişini güncelle
        setChatHistory([...chatHistory, { sender: 'bot', message: question }, { sender: 'user', message: answer }]);
        setUserAnswer('');
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // Oturumu sonlandır
          axios.post('http://localhost:5000/api/end-session', { sessionId })
            .then(res => {
              console.log('Oturum sonlandırıldı');
            })
            .catch(err => {
              console.error('Oturum sonlandırılamadı:', err);
            });
        }
      })
      .catch(error => {
        console.error('Cevap gönderilemedi:', error);
      });
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <div className="chat-window">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.sender}`}>
            {chat.message}
          </div>
        ))}
        {currentQuestionIndex < questions.length && (
          <div className="chat-message bot">
            {questions[currentQuestionIndex]}
          </div>
        )}
      </div>
      {currentQuestionIndex < questions.length ? (
        <div className="chat-input">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Gönder</button>
        </div>
      ) : (
        <div>
          <p>Sorular tamamlandı. Teşekkürler!</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
