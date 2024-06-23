const Venta = require("../models/ventaModel");
const Notificacion = require("../models/notificacionModel");
const Producto_Vendido = require("../models/producto_vendidoModel");
const Producto = require("../models/productoModel");
const Servicio_Prestado = require("../models/servicio_prestadoModel");
const asyncHandler = require("express-async-handler");

// Método CREAR VENTA, PRODUCTOS VENDIDOS Y SERVICIOS PRESTADOS
const createVenta = asyncHandler(async (req, res) => {
  const { productos_vendidos, servicios_prestados, ...ventaData } = req.body;

  console.log('Request body:', req.body); // Log del cuerpo de la solicitud

  try {
    // Crear la venta
    const nuevaVenta = await Venta.create(ventaData);

    // Crear los productos vendidos asociados a la venta
    const productosVendidosCreados = await Producto_Vendido.insertMany(
      productos_vendidos.map(producto => ({ ...producto, id_venta: nuevaVenta._id }))
    );
    console.log('Productos vendidos creados:', productosVendidosCreados);

    // Actualizar la cantidad disponible de cada producto
    await Promise.all(
      productos_vendidos.map(async (productoVendido) => {
        const prod = await Producto.findById(productoVendido.id_producto).populate('proveedores');
        if (prod) {
          prod.cantidad_disponible -= productoVendido.cantidad;
          await prod.save();

          // Verificar si la cantidad disponible es menor o igual a la cantidad mínima
          if (prod.cantidad_disponible <= prod.cantidad_minima) {
            // Construir el mensaje de notificación con los nombres y teléfonos de los proveedores
            let mensaje = `Producto con referencia ${prod.referencia} - ${prod.nombre} está por debajo o igual a la cantidad mínima.`;
            if (prod.proveedores && prod.proveedores.length > 0) {
              mensaje += ` Proveedores: `;
              prod.proveedores.forEach((proveedor, index) => {
                mensaje += `${proveedor.nombre} con número de telefono: ${proveedor.telefono}`;
                if (index !== prod.proveedores.length - 1) {
                  mensaje += ', ';
                }
              });
            }

            // Persistir la notificación
            const notificacion = new Notificacion({
              producto_id: prod._id,
              mensaje: mensaje,
            });
            await notificacion.save();
          }
        }
      })
    );
    // Crear los servicios prestados asociados a la venta
    const serviciosPrestadosCreados = await Servicio_Prestado.insertMany(
      servicios_prestados.map(servicio => ({ ...servicio, id_venta: nuevaVenta._id }))
    );
    console.log('Servicios prestados creados:', serviciosPrestadosCreados);

    res.status(200).json({
      venta: nuevaVenta,
      productos_vendidos: productosVendidosCreados,
      servicios_prestados: serviciosPrestadosCreados
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la venta', error: error.message });
  }
});

const getVenta = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener la venta por ID
    const venta = await Venta.findById(id);
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    // Obtener los productos vendidos asociados a la venta
    const productos_vendidos = await Producto_Vendido.find({ id_venta: id });

    // Obtener los servicios prestados asociados a la venta
    const servicios_prestados = await Servicio_Prestado.find({ id_venta: id });

    res.status(200).json({
      venta,
      productos_vendidos,
      servicios_prestados
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la venta', error: error.message });
  }
});

// Método para obtener todas las ventas
const getAllVentas = asyncHandler(async (req, res) => {
  try {
    // Obtener todas las ventas
    const ventas = await Venta.find();

    // Obtener todos los productos vendidos y servicios prestados asociados a las ventas
    const productos_vendidos = await Producto_Vendido.find();
    const servicios_prestados = await Servicio_Prestado.find();

    // Crear un mapa para asociar productos vendidos y servicios prestados a sus respectivas ventas
    const ventasMap = ventas.map(venta => ({
      venta,
      productos_vendidos: productos_vendidos.filter(producto => producto.id_venta.toString() === venta._id.toString()),
      servicios_prestados: servicios_prestados.filter(servicio => servicio.id_venta.toString() === venta._id.toString())
    }));

    res.status(200).json(ventasMap);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
  }
});

module.exports = {
  createVenta,
  getVenta,
  getAllVentas
};
