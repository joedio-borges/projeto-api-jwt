require('dotenv').config(); // Carrega as variáveis do .env

const express = require('express');
const db = require('./models'); // Importa o index.js dos models
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path'); // Módulo nativo do Node.js

const app = express();
app.use(express.json()); // Middleware para interpretar JSON

// Configuração do Template Engine (PUG)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos (CSS, JS do cliente, imagens)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulários HTML

// Rotas
app.get('/', (req, res) => {
  res.send('API de Autenticação JWT com Node.js e Sequelize');
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Novas rotas para renderizar as views
const viewRoutes = require('./routes/viewRoutes');
app.use('/', viewRoutes);

const PORT = process.env.PORT || 3000;

// Sincroniza o Sequelize com o banco e inicia o servidor
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
});