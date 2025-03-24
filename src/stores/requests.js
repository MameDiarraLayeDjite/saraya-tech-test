import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useRequestsStore = defineStore('requests', () => {
  const requests = ref(JSON.parse(localStorage.getItem('adminRequests')) || [])
  
  const addRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      updatedAt: null // Ajout pour le suivi des modifications
    }
    requests.value.push(newRequest)
  }
  
  const updateRequestStatus = (id, status) => {
    const index = requests.value.findIndex(req => req.id === id)
    if (index !== -1) {
      requests.value[index].status = status
      requests.value[index].updatedAt = new Date().toISOString()
    }
  }
  
  // Nouvelle fonction pour mettre à jour une demande
  const updateRequest = (id, updatedData) => {
    const index = requests.value.findIndex(req => req.id === id)
    if (index !== -1) {
      requests.value[index] = {
        ...requests.value[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
      }
    }
  }
  
  // Nouvelle fonction pour supprimer une demande
  const deleteRequest = (id) => {
    requests.value = requests.value.filter(req => req.id !== id)
  }
  
  watch(requests, (newRequests) => {
    localStorage.setItem('adminRequests', JSON.stringify(newRequests))
  }, { deep: true })
  
  return { 
    requests, 
    addRequest, 
    updateRequestStatus,
    updateRequest,
    deleteRequest
  }
})