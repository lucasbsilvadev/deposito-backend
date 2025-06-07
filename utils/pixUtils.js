// utils/pixUtils.js
function mapStatus(status) {
  const statusMap = {
    'pending': 'pendente',
    'approved': 'pago',
    'cancelled': 'cancelado',
    'rejected': 'cancelado',
    'refunded': 'cancelado',
    'charged_back': 'cancelado'
  };
  return statusMap[status.toLowerCase()] || 'pendente';
}

module.exports = {
  mapStatus
};