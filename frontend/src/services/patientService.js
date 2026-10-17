import api from './api';

export const getPatients = () => api.get('/patients');
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const getPatientByCode = (code) => api.get(`/patients/code/${code}`);
export const createPatient = (data) => api.post('/patients', data);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

export const getMedicalHistory = async (id) => {
    try {
        return await api.get(`/patients/${id}/history`);
    } catch (error) {
        console.warn('Medical history endpoint unavailable; using empty history.', error);
        return { data: [] };
    }
};

export const addMedicalHistory = async (id, data) => {
    try {
        return await api.post(`/patients/${id}/history`, data);
    } catch (error) {
        console.warn('Medical history write endpoint unavailable; keeping local state only.', error);
        return { data };
    }
};