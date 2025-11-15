import Navbar from "../Inicio/components/Navbar";

// Componente para una tarjeta de publicación (Post/Feed)
const PostCard = ({ name, content, image, donationText }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md">
        {/* Encabezado del Post */}
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {/* Placeholder para la foto de perfil en el post */}
                    <img src="placeholder-user-post.jpg" alt={name} className="object-cover w-full h-full" />
                </div>
                <span className="font-semibold text-gray-800">{name}</span>
            </div>
            {/* Menú de opciones (tres puntos) */}
            <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>
        </div>

        {/* Contenido del Post */}
        <div className="space-y-4">
            <p className="text-sm text-gray-700">{content}</p>
            {image && (
                <div className="w-full h-auto max-h-80 overflow-hidden rounded-lg">
                    <img src={image} alt="Contenido de la publicación" className="w-full h-full object-cover" />
                </div>
            )}
        </div>

        {/* Botones de Interacción (Solo en el primer post) */}
        {image && (
            <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                    Chat
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-full hover:bg-green-600 transition">
                    Donacion
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                    Chat
                </button>
            </div>
        )}

        {/* Texto de Donación (Solo en el segundo post) */}
        {donationText && (
            <p className="text-sm text-gray-700 mt-4 pt-4 border-t border-gray-100">
                {donationText}
            </p>
        )}
    </div>
);


export default function Perfil() {
    // Datos simulados para las publicaciones
    const posts = [
        {
            id: 1,
            name: "Pedro Perez",
            content: "Nueva colaboración con Caritas Argentina La Plata\nCalle 4 entre 49 y 50 n° 883",
            image: "image_def021.jpg", // Usa la imagen que subiste
            donationText: null,
        },
        {
            id: 2,
            name: "Pedro Perez",
            content: "Gracias Valeria Rosales por acercarte con tu equipo a brindar una tarde distinta con los chicos, enormemente agradecidos de sus donaciones con las cuales podremos seguir ayudando a los chicos ❤️",
            image: null,
            donationText: "Gracias Valeria Rosales por acercarte con tu equipo a brindar una tarde distinta con los chicos, enormemente agradecidos de sus donaciones con las cuales podremos seguir ayudando a los chicos ❤️",
        },
    ];

    return (
        <div>
            <Navbar />
            <section className="relative overflow-hidden bg-gray-50 min-h-screen">
                {/* Contenedor Principal Centrado */}
                <div className="max-w-6xl mx-auto py-16 px-4 sm:px-8">

                    {/* Contenedor Flex para Perfil y Feed */}
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Columna Izquierda: Información de Perfil y Navegación (25% en escritorio) */}
                        <div className="lg:w-1/4 space-y-4">
                            
                            {/* Tarjeta de Usuario/Navegación */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center lg:items-start space-y-4">
                                
                                {/* Placeholder para la franja superior azul */}
                                <div className="absolute top-0 left-0 w-full h-24 bg-teal-500 rounded-t-xl hidden lg:block"></div> 
                                
                                {/* Foto de Perfil */}
                                <div className="relative mt-0 lg:mt-12 z-10 w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md">
                                    <img src="placeholder-user-main.jpg" alt="Pedro Perez" className="object-cover w-full h-full" />
                                </div>
                                
                                {/* Nombre */}
                                <h2 className="text-xl font-bold text-gray-800 pt-2">Pedro Perez</h2>
                                
                                {/* Botones de Navegación Lateral */}
                                <div className="w-full space-y-3 pt-4">
                                    <button className="w-full py-2 px-4 text-center text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition shadow">
                                        Donaciones
                                    </button>
                                    <button className="w-full py-2 px-4 text-center text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow">
                                        Chats
                                    </button>
                                </div>
                            </div>
                            
                            {/* Información de Cuenta (Formulario) - ESTO SE MUEVE DE LA POSICIÓN DEL MOCKUP PARA MEJOR UX */}
                            {/* Se podría integrar en el mismo bloque o dejarlo como lo puse en la Columna Derecha para simular el diseño más fielmente */}
                        </div>

                        {/* Columna Derecha: Formulario de Datos y Publicaciones (75% en escritorio) */}
                        <div className="lg:w-3/4 space-y-8">
                            
                            {/* Bloque de Información de Perfil (Formulario) */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Detalles de la Cuenta</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Campo 1 */}
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500">Pedro Perez</label>
                                        <p className="text-sm text-gray-800 border-b border-gray-200 py-1">Pedro Perez</p>
                                    </div>
                                    {/* Campo 2 */}
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500">Provincia:</label>
                                        <p className="text-sm text-gray-800 border-b border-gray-200 py-1">Buenos Aires</p>
                                    </div>
                                    {/* Campo 3 */}
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500">Cuil/Cuit:</label>
                                        <p className="text-sm text-gray-800 border-b border-gray-200 py-1">XX-XXXXXXXX-X</p>
                                    </div>
                                    {/* Campo 4 */}
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500">Localidad:</label>
                                        <p className="text-sm text-gray-800 border-b border-gray-200 py-1">La Plata</p>
                                    </div>
                                    {/* Campo 5 */}
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500">Cbu:</label>
                                        <p className="text-sm text-gray-800 border-b border-gray-200 py-1">XXXXXXXXXXXXXX</p>
                                    </div>
                                    {/* Campo 6 */}
                                    <div className="flex flex-col">
                                        <label className="text-xs font-medium text-gray-500">Alias:</label>
                                        <p className="text-sm text-gray-800 border-b border-gray-200 py-1">PEDRO.PEREZ.OK</p>
                                    </div>
                                    {/* Campo 7 (Ocupa las dos columnas) */}
                                    <div className="md:col-span-2 flex flex-col">
                                        <label className="text-xs font-medium text-gray-500">Descripción:</label>
                                        <p className="text-sm text-gray-800 border-b border-gray-200 py-1">Soy un colaborador activo de causas sociales.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bloque de Publicaciones/Feed */}
                            <div className="space-y-6">
                                {posts.map(post => (
                                    <PostCard
                                        key={post.id}
                                        name={post.name}
                                        content={post.content}
                                        image={post.id === 1 ? post.image : null} // Solo imagen en el primer post
                                        donationText={post.id === 2 ? post.donationText : null} // Solo texto en el segundo post
                                    />
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}