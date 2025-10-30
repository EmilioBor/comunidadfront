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

export async function getProductoById(id) {
    try {
        const response = await axios.get(`https://localhost:7183/api/Producto/api/v1/producto/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export async function postProducto(data) {
    try {
        const response = await axios.post(`https://localhost:7183/api/Producto/api/v1/agregar/producto`, data, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
            }
        );
        return response.data;
    } catch (error) {
        console.log(error.response.data.errors);
        console.error('Error posting product:', error);
        throw error;
    }
}

export async function putProducto(id, producto) {
    try {
        const response = await axios.put(`https://localhost:7183/api/Producto/api/v1/editar/${id}`, producto, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export async function deleteProducto(id) {
    try {
        const response = await axios.delete(`https://localhost:7183/api/Producto/api/v1/eliminar/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}