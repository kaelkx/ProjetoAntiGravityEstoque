import axios from 'axios';

// A URL base será o endpoint do webhook/API gerado no n8n.
// Por enquanto utilizamos uma variável de ambiente ou URL placeholder.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://n8n.suaempresa.com.br/webhook';

// Instância customizada do Axios preparada para usar o n8n como API Gateway
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor de Request: Adiciona token de autenticação se existir
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response: Captura erros globais
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Serviços de Ativos (CRUD) via n8n -> Monday.com
 */
export const assetService = {
  // Buscar todos os ativos ou filtrar
  getAssets: async (params) => {
    const response = await api.get('/assets', { params });
    return response.data;
  },

  // Cadastrar novo ativo
  createAsset: async (assetData) => {
    const response = await api.post('/assets', assetData);
    return response.data;
  },

  // Atualizar ativo em lote
  updateAssetsBatch: async (batchData) => {
    const response = await api.put('/assets/batch', batchData);
    return response.data;
  }
};

/**
 * Serviços de Gestão de Fornecedores
 */
export const fornecedorService = {
  // Retorna lista com metadados de paginação
  getFornecedores: async (params) => {
    // server-side pagination expected in response: { data: [...], total: 100, page: 1 }
    const response = await api.get('/fornecedores', { params });
    return response.data;
  },

  getFornecedorById: async (id) => {
    const response = await api.get(`/fornecedores/${id}`);
    return response.data;
  },

  // Suporte a Form-Data para envio de anexos
  createFornecedor: async (formData) => {
    const response = await api.post('/fornecedores', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateFornecedor: async (id, formData) => {
    const response = await api.put(`/fornecedores/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
