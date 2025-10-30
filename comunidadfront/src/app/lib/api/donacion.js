import axios from 'axios';

export async function getProducto() {
    try {
        const response = await axios.get('https://localhost:7183/api/Producto/api/v1/productos', {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}