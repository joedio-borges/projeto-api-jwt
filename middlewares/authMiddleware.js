const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Pega o token do cabeçalho de autorização
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // O formato do token é "Bearer <token>". Precisamos separar.
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  // Verifica se o token é válido
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    // Se tudo estiver ok, salva o id do usuário no request para uso posterior
    req.user = decoded; // decoded contém { id, email }
    return next();
  });
};