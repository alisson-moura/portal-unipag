import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'

import { axiosInstance } from '@kubb/plugin-client/clients/axios';
import AuthProvider from './pages/auth/auth-provider.tsx';

// --- CONFIGURAÇÃO DO INTERCEPTADOR ---
// Isso vai rodar para CADA requisição feita por esse cliente
axiosInstance.interceptors.request.use(
    (config) => {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Se o token existir, adiciona o cabeçalho Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Retorna a configuração modificada para que a requisição continue
        return config;
    },
    (error) => {
        // Faz algo com o erro da requisição
        return Promise.reject(error);
    }
);

// 3. (OPCIONAL, MAS MUITO RECOMENDADO) Adicione um Interceptador de Resposta (Response Interceptor)
// Este interceptador lida com respostas globais, como erros de autenticação.
axiosInstance.interceptors.response.use(
    (response) => {
        // Se a resposta for bem-sucedida (status 2xx), apenas a retorna
        return response;
    },
    (error) => {
        const isNotAuthUrl = error.response.config.url !== "/api/auth/login"
        
        // Se a API retornar um erro e não for de login
        if (error.response && isNotAuthUrl && error.response.status === 401) {
            // Erro 401 (Não Autorizado) geralmente significa que o token é inválido ou expirou.
            // Limpe o token do localStorage
            localStorage.removeItem('token');

            // Redireciona o usuário para a página de login.
            // O `window.location.href` força um recarregamento da página, limpando qualquer estado em memória.
            window.location.href = '/';

            console.error("Sessão expirada. Por favor, faça login novamente.");
        }

        // Rejeita a promessa para que o erro possa ser tratado localmente (ex: no `onError` de uma mutação)
        return Promise.reject(error);
    }
);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)
