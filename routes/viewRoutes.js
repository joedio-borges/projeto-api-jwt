const express = require('express');
const router = express.Router();

// Middleware simples para verificar se existe um token nos cookies
// Em um app real, a verificação seria mais robusta
const checkAuth = (req, res, next) => {
    // Para este exemplo, não vamos implementar autenticação via cookie/sessão no servidor para as views,
    // a lógica de auth ficará no client-side. Apenas redirecionamos se não houver token simulado.
    // A proteção real acontece na API.
    next();
};

router.get('/', (req, res) => {
    res.render('pages/index', { title: 'Página Inicial' });
});

router.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Login' });
});

router.get('/register', (req, res) => {
    res.render('pages/register', { title: 'Registro' });
});

// Rota protegida para o painel de produtos
router.get('/products', checkAuth, (req, res) => {
    res.render('pages/products', { title: 'Meus Produtos' });
});

module.exports = router;