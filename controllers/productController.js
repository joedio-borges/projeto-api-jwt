const { Product } = require('../models');

exports.create = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    // req.user é adicionado pelo middleware de autenticação
    const product = await Product.create({ name, description, price, userId: req.user.id });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar produto' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { userId: req.user.id } });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const [updated] = await Product.update({ name, description, price }, {
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!updated) return res.status(404).json({ error: 'Produto não encontrado' });
    const updatedProduct = await Product.findByPk(req.params.id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar produto' });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Produto não encontrado' });
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};