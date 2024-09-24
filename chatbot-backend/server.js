const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const dbConnection = require('./config/dbConnection')
const bodyParser = require('body-parser');
const Session = require('./models/Session');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

// Yeni bir oturum başlatma
app.post('/api/start-session', async (req, res) => {
    try {
        const sessionId = uuidv4();

        const session = new Session({ sessionId });
        await session.save();
        res.json({ sessionId });
        
    } catch (error) {
          console.error('Hata:', error);
      res.status(500).json({ message: 'Sunucu hatası' });  
    }
});

// Cevap gönderme ve kaydetme
app.post('/api/answer', async (req, res) => {
    try {
      const { sessionId, question, answer } = req.body;
      if (!sessionId || !question || !answer) {
        return res.status(400).json({ message: 'Eksik veri' });
      }
      const session = await Session.findOne({ sessionId });
      if (session) {
        session.qa.push({ question, answer });
        await session.save();
        res.json({ message: 'Cevap kaydedildi' });
      } else {
        res.status(404).json({ message: 'Oturum bulunamadı' });
      }
    } catch (error) {
      console.error('Hata:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  });

// Oturumu sonlandırma
app.post('/api/end-session', async (req, res) => {
    try {
  const { sessionId } = req.body;
  if(!sessionId){
    return res.status(400).json({ message: 'Eksik veri' });

  }
  const session = await Session.findOne({ sessionId });
  if (session) {
    session.endedAt = new Date();
    await session.save();
    res.json({ message: 'Oturum sonlandırıldı' });
  } else {
    res.status(404).json({ message: 'Oturum bulunamadı' });
  }
  
    
} catch (error) {
      console.error('Hata:', error);
  res.status(500).json({ message: 'Sunucu hatası' });  
}
});

app.get('/', (req, res) => {
  res.send('Backend çalışıyor!');
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
