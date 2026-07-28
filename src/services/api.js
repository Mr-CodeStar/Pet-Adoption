const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
  }
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Helper for standard HTTP request handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status} Request Failed`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    if (err.name === 'TypeError' || err.message?.includes('Failed to fetch')) {
      throw new Error(`Unable to connect to backend server. Please ensure the server is running at ${API_BASE_URL}.`);
    }
    throw err;
  }
}

export const api = {
  // Public Pet APIs
  async getPets() {
    return request('/pets');
  },

  async getPetById(id) {
    return request(`/pets/${id}`);
  },

  async giveTreat(id) {
    return request(`/pets/${id}/treat`, { method: 'POST' });
  },

  async toggleFavorite(id) {
    return request(`/pets/${id}/favorite`, { method: 'POST' });
  },

  async submitApplication(applicationData) {
    return request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  // User Auth APIs
  async userRegister(userData) {
    return request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async userLogin(email, password) {
    return request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async getUserProfile(token) {
    return request('/users/me', { token });
  },

  async updateUserProfile(profileData, token) {
    return request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
      token
    });
  },

  async getMyPets(token) {
    return request('/pets/my-pets', { token });
  },

  // Admin Auth APIs
  async adminLogin(username, password) {
    return request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  async verifyToken(token) {
    return request('/admin/verify', { token });
  },

  async getAdminStats(token) {
    return request('/admin/stats', { token });
  },

  // Admin Pet CRUD APIs
  async createPet(petData, token) {
    return request('/pets', {
      method: 'POST',
      body: JSON.stringify(petData),
      token
    });
  },

  async updatePet(id, petData, token) {
    return request(`/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(petData),
      token
    });
  },

  async deletePet(id, token) {
    return request(`/pets/${id}`, {
      method: 'DELETE',
      token
    });
  },

  // Admin Applications CRUD APIs
  async getApplications(token) {
    return request('/applications', { token });
  },

  async updateApplicationStatus(id, status, token) {
    return request(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token
    });
  },

  async deleteApplication(id, token) {
    return request(`/applications/${id}`, {
      method: 'DELETE',
      token
    });
  }
};

export default api;
