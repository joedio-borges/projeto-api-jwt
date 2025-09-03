const { User } = require('../models');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    // Não retornar a senha
    const userResult = user.get({ plain: true });
    delete userResult.password;

    res.status(201).json({ message: 'Usuário registrado com sucesso!', user: userResult });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar usuário', details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    // Autenticação bem-sucedida, gerar o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Carga útil (payload)
      process.env.JWT_SECRET,             // Chave secreta
      { expiresIn: '1h' }                  // Opções (token expira em 1 hora)
    );

    res.status(200).json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};