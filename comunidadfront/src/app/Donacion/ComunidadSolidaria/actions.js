// Donacion/ComunidadSolidaria/actions.js
'use server';

export async function crearDonacionComunidad(data) {
  try {
    const response = await fetch('https://localhost:7168/api/Donacion/api/v1/agrega/donacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en server action crearDonacionComunidad:', error);
    throw error;
  }
}

export async function obtenerTiposDonacion() {
  try {
    const response = await fetch('https://localhost:7168/api/DonacionTipo/api/v1/donacionTipos', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en server action obtenerTiposDonacion:', error);
    throw error;
  }
}