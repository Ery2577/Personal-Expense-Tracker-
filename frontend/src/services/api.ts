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

// Types pour les expenses
export interface Category {
  id: string;
  name: string;
}

export interface CreateExpenseData {
  categoryId: string;
  amount: number;
  description?: string;
  paymentMethod: string;
  date: string;
  type?: string;
}

export interface Expense {
  id: string;
  amount: number;
  description?: string;
  paymentMethod: string;
  date: string;
  category: Category;
  createdAt: string;
}

// Services pour les catégories
export const categoryService = {
  // Récupérer toutes les catégories
  getCategories: (token: string): Promise<{ success: boolean; data: Category[] }> => {
    return makeRequest('/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Types pour les incomes
export interface CreateIncomeData {
  amount: number;
  source: string;
  description?: string;
  date: string;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  description?: string;
  date: string;
  createdAt: string;
}

// Services pour les expenses
export const expenseService = {
  // Créer une expense
  createExpense: (expenseData: CreateExpenseData, token: string): Promise<{ success: boolean; data: Expense }> => {
    return makeRequest('/transactions/expenses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
  },

  // Récupérer toutes les expenses
  getExpenses: (token: string): Promise<{ success: boolean; data: Expense[] }> => {
    return makeRequest('/transactions/expenses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Mettre à jour une expense
  updateExpense: (token: string, id: string, expenseData: CreateExpenseData): Promise<{ success: boolean; data: Expense }> => {
    return makeRequest(`/transactions/expenses/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
  },

  // Supprimer une expense
  deleteExpense: (token: string, id: string): Promise<{ success: boolean; message: string }> => {
    return makeRequest(`/transactions/expenses/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Services pour les incomes
export const incomeService = {
  // Créer un income
  createIncome: (incomeData: CreateIncomeData, token: string): Promise<{ success: boolean; data: Income }> => {
    return makeRequest('/transactions/incomes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incomeData),
    });
  },

  // Récupérer tous les incomes
  getIncomes: (token: string): Promise<{ success: boolean; data: Income[] }> => {
    return makeRequest('/transactions/incomes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Mettre à jour un income
  updateIncome: (token: string, id: string, incomeData: CreateIncomeData): Promise<{ success: boolean; data: Income }> => {
    return makeRequest(`/transactions/incomes/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incomeData),
    });
  },

  // Supprimer un income
  deleteIncome: (token: string, id: string): Promise<{ success: boolean; message: string }> => {
    return makeRequest(`/transactions/incomes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};