// URL base del API Gateway. Se puede cambiar con la variable VITE_API_URL (archivo .env).
// El "?." evita errores cuando el código corre en las pruebas (Karma/webpack no define import.meta.env).
export const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:9080/api/v1';
