import axios from 'axios';

export async function GetLocalidadesApi() {
    try {
        const response = await axios.get('https://localhost:7168/api/Localidad/api/v1/localidads', {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}