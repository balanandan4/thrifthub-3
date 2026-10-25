import { Resource, PurchaseRequest, NotificationItem, DashboardMetrics, AdminStats, User, RequestHistoryItem, AuditLog } from './types';

const API_BASE = '/api';

function getStoredToken(): string | null {
  return localStorage.getItem('thrifthub_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('thrifthub_token', token);
  } else {
    localStorage.removeItem('thrifthub_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

// Auth API
export const api = {
  // Auth
  async login(email: string, password: string) {
    const data = await request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  async register(payload: {
    full_name: string;
    email: string;
    password: string;
    college_id?: string;
    branch?: string;
    year?: string;
    phone?: string;
  }) {
    const data = await request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setStoredToken(data.token);
    return data;
  },

  async getMe() {
    return request<{ user: User }>('/auth/me');
  },

  async logout() {
    setStoredToken(null);
    return request<{ message: string }>('/auth/logout', { method: 'POST' });
  },

  async updateProfile(payload: { full_name?: string; college_id?: string; branch?: string; year?: string; phone?: string; bio?: string }) {
    return request<{ user: User; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async changePassword(current_password: string, new_password: string) {
    return request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password, new_password }),
    });
  },

  // Resources
  async getResources(params?: { category?: string; availability?: string; search?: string; semester?: string; sort?: string }) {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.availability) query.append('availability', params.availability);
    if (params?.search) query.append('search', params.search);
    if (params?.semester) query.append('semester', params.semester);
    if (params?.sort) query.append('sort', params.sort);
    return request<{ resources: Resource[] }>(`/resources?${query.toString()}`);
  },

  async getResourceById(id: string) {
    return request<{ resource: Resource; total_requests: number }>(`/resources/${id}`);
  },

  async createResource(payload: {
    title: string;
    category: string;
    subject: string;
    semester: string;
    author_or_brand: string;
    price: number;
    condition: string;
    description: string;
    image_url?: string;
  }) {
    return request<{ resource: Resource; message: string }>('/resources', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateResource(id: string, payload: Partial<Resource>) {
    return request<{ resource: Resource; message: string }>(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteResource(id: string) {
    return request<{ message: string }>(`/resources/${id}`, {
      method: 'DELETE',
    });
  },

  async getMyListings() {
    return request<{ listings: Resource[] }>('/seller/my-listings');
  },

  // Requests
  async sendRequest(resource_id: string, message: string, contact_info?: string) {
    return request<{ requestId: string; message: string }>('/requests', {
      method: 'POST',
      body: JSON.stringify({ resource_id, message, contact_info }),
    });
  },

  async getMyRequests() {
    return request<{ requests: PurchaseRequest[] }>('/requests/my');
  },

  async getIncomingRequests() {
    return request<{ requests: PurchaseRequest[] }>('/requests/incoming');
  },

  async getRequestDetails(id: string) {
    return request<{ request: PurchaseRequest; history: RequestHistoryItem[] }>(`/requests/${id}`);
  },

  async respondToRequest(id: string, decision: 'Accepted' | 'Rejected', note?: string) {
    return request<{ message: string }>(`/requests/${id}/respond`, {
      method: 'PUT',
      body: JSON.stringify({ decision, note }),
    });
  },

  async completeRequest(id: string, note?: string) {
    return request<{ message: string }>(`/requests/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ note }),
    });
  },

  // Notifications
  async getNotifications() {
    return request<{ notifications: NotificationItem[]; unread_count: number }>('/notifications');
  },

  async markNotificationRead(id: string) {
    return request<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead() {
    return request<{ success: boolean }>('/notifications/read-all', { method: 'PUT' });
  },

  // Dashboard
  async getDashboardSummary() {
    return request<{
      metrics: DashboardMetrics;
      recent_incoming: any[];
      recent_outgoing: any[];
    }>('/dashboard/summary');
  },

  // Admin
  async getAdminStats() {
    return request<AdminStats>('/admin/stats');
  },

  async getAdminUsers() {
    return request<{ users: (User & { listing_count: number; request_count: number })[] }>('/admin/users');
  },

  async getAdminAuditLogs() {
    return request<{ logs: AuditLog[] }>('/admin/audit-logs');
  },

  // Gemini AI Assistant
  async getAiListingSuggestions(title: string, details?: string) {
    return request<{
      category: string;
      suggested_price: number;
      price_range: string;
      suggested_subject: string;
      semester: string;
      edition_note?: string;
      summary_description?: string;
    }>('/ai/suggest-listing', {
      method: 'POST',
      body: JSON.stringify({ title, details }),
    });
  },

  async getAiResourceMatcher(branch: string, semester: string, needed_subject: string) {
    return request<{
      recommendations?: Resource[];
      recommended_item_ids?: string[];
      study_advice?: string;
      syllabus_advice?: string;
    }>('/ai/match-resources', {
      method: 'POST',
      body: JSON.stringify({ branch, semester, needed_subject }),
    });
  },
};
