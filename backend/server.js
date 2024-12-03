const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Rota para consultar todos os produtos
app.get('/produtos', async (req, res) => {
  const { data, error } = await supabase.from('produtos').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Rota para consultar um produto pelo ID
app.get('/produtos/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(data);
});

// Rota para cadastrar um produto
app.post('/produtos', async (req, res) => {
  const { nome, descricao, preco } = req.body;
  const { data, error } = await supabase
    .from('produtos')
    .insert({ nome, descricao, preco })
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Rota para alterar um produto
app.put('/produtos/:id', async (req, res) => {
  const { nome, descricao, preco } = req.body;
  const { data, error } = await supabase
    .from('produtos')
    .update({ nome, descricao, preco })
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  if (data.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(data[0]);
});

// Rota para deletar um produto
app.delete('/produtos/:id', async (req, res) => {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});