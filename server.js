// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Rota para salvar orçamento com cliente e tipo de pintura
app.post('/api/orcamento', (req, res) => {
  const { cliente, metragem, tipo } = req.body;

  let preco_m2 = 0;
  if (tipo === 'normal') preco_m2 = 10;
  else if (tipo === 'emborrachada') preco_m2 = 12;
  else if (tipo === 'textura') preco_m2 = 25;
  else return res.status(400).json({ erro: 'Tipo de pintura inválido' });

  const total = metragem * preco_m2;

  db.run(
    'INSERT INTO orcamentos (cliente, metragem, tipo, preco_m2, total) VALUES (?, ?, ?, ?, ?)',
    [cliente, metragem, tipo, preco_m2, total],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      return res.json({ id: this.lastID, cliente, metragem, tipo, preco_m2, total });
    }
  );
});

// Rota para listar orçamentos
app.get('/api/orcamentos', (req, res) => {
  db.all('SELECT * FROM orcamentos ORDER BY criado_em DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando em http://0.0.0.0:3000');
});
