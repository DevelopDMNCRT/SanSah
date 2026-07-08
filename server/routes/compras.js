const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/compras — Obtener todas las compras registradas
router.get('/', async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        items: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
    res.json(compras);
  } catch (error) {
    console.error('Error en GET /api/compras:', error);
    res.status(500).json({ error: 'Error al obtener las compras' });
  }
});

// GET /api/compras/:id — Obtener detalle de una compra
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const compra = await prisma.compra.findUnique({
      where: { id },
      include: {
        items: true
      }
    });
    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    res.json(compra);
  } catch (error) {
    console.error('Error en GET /api/compras/:id:', error);
    res.status(500).json({ error: 'Error al obtener la compra' });
  }
});

// POST /api/compras — Registrar una nueva compra y actualizar inventario
router.post('/', async (req, res) => {
  const { factura, fecha, proveedor, formaPago, total, items } = req.body;

  if (!factura || !fecha || !proveedor || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (factura, fecha, proveedor, items)' });
  }

  try {
    // Ejecutar todo en una transacción para asegurar consistencia
    const result = await prisma.$transaction(async (tx) => {
      let nuevosProductosCreados = 0;

      // 1. Crear registro de Compra
      const compra = await tx.compra.create({
        data: {
          factura,
          fecha: new Date(fecha),
          proveedor,
          forma_pago: formaPago,
          total: parseFloat(total)
        }
      });

      // 2. Procesar cada ítem
      for (const item of items) {
        const qty = parseInt(item.cantidad);
        const price = parseFloat(item.precioUnitario);
        const iva = parseFloat(item.iva) || 0;
        const discount = parseFloat(item.descuento) || 0;
        let prodId = item.productId ? parseInt(item.productId) : null;
        const varId = item.variationId ? parseInt(item.variationId) : null;

        // Si prodId es null y el nombre es válido, lo creamos automáticamente
        if (!prodId && item.producto && item.producto.trim().length > 0) {
          const baseSlug = item.producto.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const uniqueSlug = `${baseSlug || 'producto'}-${Date.now()}`;

          const newProduct = await tx.product.create({
            data: {
              nombre: item.producto.trim(),
              stock: qty,
              costo_real: price, // Guardamos el costo real
              es_publico: false, // Forma privada
              es_publico_pos: false, // Forma privada
              slug: uniqueSlug,
              descripcion: `Producto ingresado automáticamente mediante Compra Factura: ${factura}`,
            }
          });
          prodId = newProduct.id;
          nuevosProductosCreados++;

          // Registrar movimiento de entrada
          await tx.inventarioMovimiento.create({
            data: {
              product_id: prodId,
              tipo: 'entrada',
              cantidad: qty,
              costo_unitario: price,
              referencia: factura,
              motivo: `Compra Factura: ${factura} (Creación Automática)`,
              forma_pago: formaPago
            }
          });
        } else if (prodId) {
          const product = await tx.product.findUnique({
            where: { id: prodId },
            include: { variaciones: true }
          });

          if (product) {
            if (product.es_variable) {
              // Si es variable y se especificó variación, la actualizamos
              if (varId) {
                const variation = product.variaciones.find(v => v.id === varId);
                await tx.productVariation.update({
                  where: { id: varId },
                  data: {
                    stock: {
                      increment: qty
                    }
                  }
                });

                // Registrar movimiento de inventario para el historial
                await tx.inventarioMovimiento.create({
                  data: {
                    product_id: prodId,
                    tipo: 'entrada',
                    cantidad: qty,
                    costo_unitario: price,
                    referencia: factura,
                    motivo: `Compra Factura: ${factura} (Variación: ${variation ? variation.valor : varId})`,
                    forma_pago: formaPago
                  }
                });
              }
            } else {
              // Si es producto simple, creamos un movimiento de entrada y actualizamos stock
              await tx.inventarioMovimiento.create({
                data: {
                  product_id: prodId,
                  tipo: 'entrada',
                  cantidad: qty,
                  costo_unitario: price,
                  referencia: factura,
                  motivo: `Compra Factura: ${factura}`,
                  forma_pago: formaPago
                }
              });

              const currentStock = product.stock || 0;
              await tx.product.update({
                where: { id: prodId },
                data: {
                  stock: currentStock + qty
                }
              });
            }
          }
        }

        // Guardar ítem en compras_detalles vinculado al ID correcto
        await tx.compraItem.create({
          data: {
            compra_id: compra.id,
            cantidad: qty,
            producto: item.producto,
            precio_unitario: price,
            iva,
            descuento: discount,
            product_id: prodId
          }
        });
      }

      return {
        compra,
        nuevosProductosCreados
      };
    });

    res.status(201).json(result);

  } catch (error) {
    console.error('Error al registrar la compra:', error);
    res.status(500).json({ error: 'Error interno del servidor al registrar la compra' });
  }
});

// DELETE /api/compras/:id — Eliminar una compra (opcional / deshacer)
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.compra.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Compra eliminada exitosamente' });
  } catch (error) {
    console.error('Error en DELETE /api/compras/:id:', error);
    res.status(500).json({ error: 'Error al eliminar la compra' });
  }
});

module.exports = router;
