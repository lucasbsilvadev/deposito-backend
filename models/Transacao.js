const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transacao = sequelize.define('Transacao', {
  valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  transacaoId: { type: DataTypes.STRING, allowNull: false },
  produto: { type: DataTypes.STRING, allowNull: false },
  quantidade: { type: DataTypes.INTEGER, defaultValue: 1 },
  cliente: { type: DataTypes.STRING, allowNull: false },
  whatsapp: { type: DataTypes.STRING, allowNull: true },
  status: {
    type: DataTypes.ENUM('pendente', 'pago', 'cancelado'),
    defaultValue: 'pendente'
  },
  codigoPix: { type: DataTypes.TEXT },
  expiracao: { type: DataTypes.DATE }
});

module.exports = Transacao;
