import React, { useState, useContext } from 'react';
import NavbarComplex from './NavbarComplex';
import { useAuth } from '../context/AuthContext';

function CartaPresentacion() {
    const { user, token } = useAuth();
    const [documentUrl, setDocumentUrl] = useState('');
    const [documentGenerated, setDocumentGenerated] = useState(false); // Estado para controlar la visibilidad de los botones
    const [error, setError] = useState(null); // Estado para manejar el error

    const generarCarta = async () => {
        try {
            // Obtener los datos del usuario
            const userResponse = await fetch(`https://django-api-servicio.onrender.com/usuario/${user.id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!userResponse.ok) {
                throw new Error('Error al obtener los datos del usuario');
            }

            const userData = await userResponse.json();

            // Obtener los datos del servicio social del usuario
            const socialServiceResponse = await fetch(`https://django-api-servicio.onrender.com/servicio-social/usuario/${user.id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!socialServiceResponse.ok) {
                throw new Error('Error al obtener los datos del servicio social');
            }

            const socialServiceData = await socialServiceResponse.json();

            const documentData = {
                nombre: userData.first_name,
                apellido: userData.last_name,
                numero_control: userData.username,
                carrera: userData.carrera,
                dependencia: socialServiceData.dependencia_organizacion,
                nombre_programa: socialServiceData.nombre_programa,
                titular: socialServiceData.titular_organizacion,
                cargo: socialServiceData.cargo_titular,
                atencion_nombre: socialServiceData.atencion_a_nombre,
                atencion_cargo: socialServiceData.atencion_a_cargo
            };

            const documentResponse = await fetch('https://django-api-servicio.onrender.com/api/document/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(documentData)
            });

            if (!documentResponse.ok) {
                throw new Error('Error al generar el documento');
            }

            const blob = await documentResponse.blob();
            const url = URL.createObjectURL(blob);
            setDocumentUrl(url);
            setDocumentGenerated(true); // Cambia el estado para ocultar el botón de generar y mostrar el de descargar
            setError(null); // Limpia el error en caso de éxito

        } catch (error) {
            console.error('Error:', error);
            setError('Se produjo un error al generar la carta de presentación');
        }
    };

    const cerrarModal = () => {
        setError(null); // Limpiar el error
    };

    return (
        <div>
            <NavbarComplex />
            <section className='mt-10'>
                <h1 className="text-2xl font-semibold text-blue-900 mb-10">Carta Presentación</h1>
                {!documentGenerated && (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={generarCarta}>
                        Generar Carta Presentación
                    </button>
                )}
                {documentUrl && (
                    <a href={documentUrl} download="Carta_Presentacion.docx">
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-5">
                            Descargar Documento
                        </button>
                    </a>
                )}
                {/* Mostrar el modal de error si hay un error */}
                {error && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <svg className="h-6 w-6 text-red-600" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Error
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm leading-5 text-gray-500">
                                                Porfavor asegurate de que tu información de servicio social esté completa. Si el problema persiste, contacta a soporte.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                                            <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5" onClick={cerrarModal}>
                                                Cerrar
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default CartaPresentacion;
