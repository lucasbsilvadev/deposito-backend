require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig } = require('mercadopago');
const sequelize = require('./config/db');

const app = express();



// Middlewares
app.use(cors());
app.use(express.json());

// Teste conexão MySQL
sequelize.authenticate()
  .then(() => console.log('Conectado ao MySQL'))
  .catch(err => console.error('Erro MySQL:', err));

// Rotas
app.use('/api/pix', require('./routes/pixRoutes'));

// Sincroniza modelos com o banco
sequelize.sync()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  });

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});