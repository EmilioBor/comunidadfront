// app/Donacion/Detalle/actions.js
'use server'


// Crear detalle de donación
export async function crearDonacionDetalle(detalleData) {
  try {
    const endpoint = 'https://localhost:7168/api/DetalleDonacion/';
    

    const datosParaEnviar = {
      descripcion: String(detalleData.Descripcion),
      donacionIdDonacion: Number(detalleData.DonacionIdDonacion),
      cantidad: Number(detalleData.Cantidad)
    };

    console.log (datosParaEnviar)

    const response = await fetch('https://localhost:7168/api/v1/DetalleDonacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosParaEnviar)
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Error creando detalle: ${msg}`);
    }

    const res = await response.json();

    // 👇 TOMAR EL ID REAL DEVUELTO POR EL BACKEND
    const detalleIdReal =
      res.detalleDonacionId ||
      res.id ||
      res.Id ||
      null;

    if (!detalleIdReal) {
      throw new Error("No se pudo obtener el ID del detalle creado");
    }

    // Crear estado "Pendiente"
    await crearEstadoPendiente(datosParaEnviar.donacionIdDonacion);

    return {
      success: true,
      message: "Detalle creado correctamente",
      detalleIdReal
    };

  } catch (error) {
    console.error("❌ Error crearDonacionDetalle:", error);
    return { success: false, error: error.message };
  }
}

// Crear estado pendiente
async function crearEstadoPendiente( donacionIdDonacion) {
  try {
    const estadoData = {
      nombre: "Pendiente",
      donacionIdDonacion: Number(donacionIdDonacion)
    };

    console.log("📤 Enviando estado pendiente:", estadoData);

    const response = await fetch('https://localhost:7168/api/DonacionEstado/api/v1/agrega/detalleDonacionTipo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(estadoData)
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Error creando estado: ${msg}`);
    }

    return true;

  } catch (error) {
    console.error("❌ Error crearEstadoPendiente:", error);
    return false;
  }
}