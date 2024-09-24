const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/chatbotDB'; // Yerel MongoDB bağlantı URI'si

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch((err) => console.error('MongoDB bağlantı hatası:', err));