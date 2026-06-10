const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { MercadoPagoConfig, Payment } = require('mercadopago');

// Inicializar cliente de Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000', options: { timeout: 5000 } });

router.post('/process_payment', async (req, res) => {
  try {
    const { formData, orderData } = req.body;
    
    // Configurar Payment con los datos recibidos del Brick
    const payment = new Payment(client);
    
    // Aquí mandamos la petición real a MercadoPago para procesar el cargo
    const paymentResult = await payment.create({
      body: {
        transaction_amount: formData.transaction_amount,
        token: formData.token,
        description: 'Compra en SanSah Bikes',
        installments: formData.installments,
        payment_method_id: formData.payment_method_id,
        issuer_id: formData.issuer_id,
        payer: {
          email: formData.payer.email,
          identification: {
            type: formData.payer.identification.type,
            number: formData.payer.identification.number
          }
        }
      }
    });

    if (paymentResult.status === 'approved' || paymentResult.status === 'in_process') {
      // Si el pago es exitoso, procedemos a crear la orden en nuestra Base de Datos
      const nuevoPedido = await prisma.pedido.create({
        data: {
          nombre: orderData.nombre,
          correo: orderData.correo,
          total: orderData.total,
          envio: orderData.envio,
          estado: 'Nuevo',
          canal_venta: 'Tienda en Línea',
          metodo_pago: 'Mercado Pago',
          items: {
            create: orderData.items
          }
        }
      });

      // (Opcional) Descontar stock aquí
      for (const item of orderData.items) {
        if (item.productoId) {
          try {
            await prisma.product.update({
              where: { id: parseInt(item.productoId) },
              data: { stock: { decrement: item.cantidad } }
            });
          } catch (e) {
            console.error('No se pudo descontar stock para el item:', item.productoId);
          }
        }
      }

      res.status(200).json({ status: paymentResult.status, pedidoId: nuevoPedido.id });
    } else {
      res.status(400).json({ status: paymentResult.status, message: 'Pago rechazado o en revisión' });
    }

  } catch (error) {
    console.error('Error al procesar el pago con MP:', error);
    res.status(500).json({ error: 'Hubo un problema al procesar el pago' });
  }
});

module.exports = router;
