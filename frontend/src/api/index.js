import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (data) => axiosClient.post('/auth/register', data),
  getCurrentUser: () => axiosClient.get('/auth/me'),
};

export const eventApi = {
  getAll: () => axiosClient.get('/events'),
  getById: (id) => axiosClient.get(`/events/${id}`),
  search: (params) => axiosClient.get('/events/search', { params }),
  create: (data) => axiosClient.post('/events', data),
  update: (id, data) => axiosClient.put(`/events/${id}`, data),
  delete: (id) => axiosClient.delete(`/events/${id}`),
};

export const teamApi = {
  getAll: () => axiosClient.get('/teams'),
  getByEvent: (eventId) => axiosClient.get(`/teams/event/${eventId}`),
  getMyTeams: () => axiosClient.get('/teams/my-teams'),
  getMyLedTeams: () => axiosClient.get('/teams/my-led-teams'),
  getById: (id) => axiosClient.get(`/teams/${id}`),
  getMembers: (id) => axiosClient.get(`/teams/${id}/members`),
  create: (data) => axiosClient.post('/teams', data),
  update: (id, data) => axiosClient.put(`/teams/${id}`, data),
  delete: (id) => axiosClient.delete(`/teams/${id}`),
  addMember: (data) => axiosClient.post('/teams/members', data),
  removeMember: (teamId, userId) => axiosClient.delete(`/teams/${teamId}/members/${userId}`),
};

export const taskApi = {
  getAll: () => axiosClient.get('/tasks'),
  getById: (id) => axiosClient.get(`/tasks/${id}`),
  search: (params) => axiosClient.get('/tasks/search', { params }),
  getMyTasks: () => axiosClient.get('/tasks/my-tasks'),
  getByEvent: (eventId) => axiosClient.get(`/tasks/event/${eventId}`),
  getByTeam: (teamId) => axiosClient.get(`/tasks/team/${teamId}`),
  create: (data) => axiosClient.post('/tasks', data),
  update: (id, data) => axiosClient.put(`/tasks/${id}`, data),
  updateStatus: (id, data) => axiosClient.put(`/tasks/${id}/status`, data),
  delete: (id) => axiosClient.delete(`/tasks/${id}`),
};

export const resourceApi = {
  getAll: () => axiosClient.get('/resources'),
  getById: (id) => axiosClient.get(`/resources/${id}`),
  search: (params) => axiosClient.get('/resources/search', { params }),
  create: (data) => axiosClient.post('/resources', data),
  update: (id, data) => axiosClient.put(`/resources/${id}`, data),
  delete: (id) => axiosClient.delete(`/resources/${id}`),
};

export const approvalApi = {
  getAll: (params) => axiosClient.get('/resource-requests', { params }),
  getMyRequests: () => axiosClient.get('/resource-requests/my-requests'),
  search: (params) => axiosClient.get('/resource-requests/search', { params }),
  createRequest: (data) => axiosClient.post('/resource-requests', data),
  approve: (id, data) => axiosClient.put(`/resource-requests/${id}/approve`, data),
  reject: (id, data) => axiosClient.put(`/resource-requests/${id}/reject`, data),
};

export const vendorApi = {
  getAll: () => axiosClient.get('/vendors'),
  getById: (id) => axiosClient.get(`/vendors/${id}`),
  getByEvent: (eventId) => axiosClient.get(`/vendors/event/${eventId}`),
  search: (params) => axiosClient.get('/vendors/search', { params }),
  create: (data) => axiosClient.post('/vendors', data),
  update: (id, data) => axiosClient.put(`/vendors/${id}`, data),
  delete: (id) => axiosClient.delete(`/vendors/${id}`),
};

export const userApi = {
  getAll: (params) => axiosClient.get('/users', { params }),
  getVolunteers: () => axiosClient.get('/users/volunteers'),
  getTeamLeads: () => axiosClient.get('/users/team-leads'),
  getById: (id) => axiosClient.get(`/users/${id}`),
  updateRole: (id, role) => axiosClient.put(`/users/${id}/role`, { role }),
  toggleStatus: (id) => axiosClient.put(`/users/${id}/toggle-status`),
};

export const dashboardApi = {
  getAdminStats: () => axiosClient.get('/dashboard/admin'),
  getCoordinatorStats: () => axiosClient.get('/dashboard/coordinator'),
  getTeamLeadStats: () => axiosClient.get('/dashboard/team-lead'),
  getVolunteerStats: () => axiosClient.get('/dashboard/volunteer'),
  getSummary: () => axiosClient.get('/dashboard/summary'),
};

export const auditLogApi = {
  getRecent: () => axiosClient.get('/audit-logs/recent'),
  search: (params) => axiosClient.get('/audit-logs', { params }),
};

export const announcementApi = {
  getAll: () => axiosClient.get('/announcements'),
  create: (data) => axiosClient.post('/announcements', data),
};
