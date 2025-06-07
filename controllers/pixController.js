const { MercadoPagoConfig, Payment } = require('mercadopago');
const Transacao = require('../models/Transacao');
const { mapStatus } = require('../utils/pixUtils');

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

exports.gerarPix = async (req, res) => {
  try {
    const { valor, produto, quantidade = 1, cliente, whatsapp } = req.body;
    const valorTotal = parseFloat(valor) * quantidade;

    const payment = await new Payment(mercadopago).create({
      body: {
        transaction_amount: valorTotal,
        description: produto,
        payment_method_id: 'pix',
        payer: {
          email: `${whatsapp}@cliente.com`,
          first_name: cliente,
          identification: {
            type: 'CPF',
            number: '08424629108',
          },
        },
      },
    });

    const { id, point_of_interaction } = payment;

    const transacao = await Transacao.create({
      valor: valorTotal,
      produto,
      quantidade,
      cliente,
      whatsapp,
      codigoPix: point_of_interaction.transaction_data.qr_code,
      transacaoId: id,
      expiracao: new Date(),
    });

    res.json({
      success: true,
      codigoPix: point_of_interaction.transaction_data.qr_code,
      transacaoId: transacao.id,
      qrCodeUrl: point_of_interaction.transaction_data.qr_code_base64,
    });

  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    res.status(500).json({ 
      error: 'Erro ao gerar PIX',
      details: error.message || error,
    });
  }
};

exports.verificarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transacao = await Transacao.findByPk(id);
    if (!transacao) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    const payment = await new Payment(mercadopago).get({ id: transacao.transacaoId });
    console.log('Status do Mercado Pago:', payment.status);

    const mappedStatus = mapStatus(payment.status);
    let shouldUpdate = false;

    // Só atualiza se o status for diferente E não for um status final
    if (transacao.status !== mappedStatus && 
        !['pago', 'cancelado'].includes(transacao.status)) {
      await transacao.update({ status: mappedStatus });
      console.log('Status atualizado para:', mappedStatus);
      shouldUpdate = true;
    }

    res.json({ 
      status: mappedStatus,
      paid_at: payment.date_approved || null,
      is_final: ['pago', 'cancelado'].includes(mappedStatus) // Indica se é um status final
    });

  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ 
      error: 'Erro ao verificar status',
      details: error.message 
    });
  }
};