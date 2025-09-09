const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
}

// Fonction utilitaire pour faire les requêtes
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('A network error occurred');
  }
};

// Services d'authentification
export const authService = {
  // Connexion
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Inscription
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Obtenir le profil utilisateur
  getProfile: (token: string): Promise<{ success: boolean; data: { user: User } }> => {
    return makeRequest('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Rafraîchir le token
  refreshToken: (token: string): Promise<{ success: boolean; data: { token: string } }> => {
    return makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Changer le mot de passe
  changePassword: (currentPassword: string, newPassword: string, token: string): Promise<{ success: boolean; message: string }> => {
    const payload = { currentPassword, newPassword };
    console.log('Sending password change request:', payload);
    console.log('Token:', token);
    
    return makeRequest('/auth/change-password', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },
};