// utils/pixUtils.js
function mapStatus(status) {
  const statusMap = {
    'pending': 'pendente',
    'approved': 'pago',
    'cancelled': 'cancelado',
    'rejected': 'rejeitado',
    'refunded': 'reembolsado',
    'charged_back': 'a transação foi desfeita'
  };
  return statusMap[status.toLowerCase()] || 'pendente';
}

module.exports = {
  mapStatus
};