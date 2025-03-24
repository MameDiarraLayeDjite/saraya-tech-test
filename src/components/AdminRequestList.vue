<template>
    <div class="admin-request-list">
      <h2>Gestion des demandes administratives</h2>
      
      <div class="filters">
        <select v-model="filterStatus">
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvé</option>
          <option value="rejected">Rejeté</option>
        </select>
        
        <button @click="toggleUrgentOnly" :class="{ active: showUrgentOnly }">
          Urgent seulement
        </button>
      </div>
      
      <div class="requests-container">
        <div v-if="filteredRequests.length === 0" class="no-requests">
          Aucune demande à afficher
        </div>
        
        <div v-for="request in filteredRequests" :key="request.id" class="request-card" :class="request.status">
          <div class="request-header">
            <h3>
              Demande #{{ request.id.slice(-4) }} - 
              {{ getTypeLabel(request.type) }} - 
              {{ request.fullName || 'Non renseigné' }}
            </h3>
            <span class="status-badge">{{ getStatusLabel(request.status) }}</span>
            <span v-if="request.isUrgent" class="urgent-badge">URGENT</span>
          </div>
          
          <div class="request-body">
            <p><strong>Description:</strong> {{ request.description }}</p>
            <p v-if="request.attachmentName">
              <strong>Pièce jointe:</strong> {{ request.attachmentName }}
              <template v-if="request.attachmentUrl">
                <a :href="request.attachmentUrl" target="_blank" class="file-action">Voir</a>
                <a :href="request.attachmentUrl" download class="file-action">Télécharger</a>
              </template>
            </p>
            <p><strong>Date création:</strong> {{ formatDate(request.createdAt) }}</p>
            <p v-if="request.updatedAt"><strong>Dernière modification:</strong> {{ formatDate(request.updatedAt) }}</p>
          </div>
          
          <div class="request-actions">
            <template v-if="request.status === 'pending'">
              <button @click="updateRequestStatus(request.id, 'approved')" class="approve-btn">Approuver</button>
              <button @click="updateRequestStatus(request.id, 'rejected')" class="reject-btn">Rejeter</button>
            </template>
            <button @click="editRequest(request)" class="edit-btn">Modifier</button>
            <button @click="confirmDelete(request.id)" class="delete-btn">Supprimer</button>
          </div>
        </div>
      </div>
      
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal">
          <h3>Confirmer la suppression</h3>
          <p>Êtes-vous sûr de vouloir supprimer cette demande ?</p>
          <div class="modal-actions">
            <button @click="deleteRequest" class="confirm-delete-btn">Confirmer</button>
            <button @click="cancelDelete" class="cancel-delete-btn">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </template>

  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { useRequestsStore } from '../stores/requests'
  
  export default {
    emits: ['edit-request'],
    setup(props, { emit }) {
      const requestsStore = useRequestsStore()
      const isLoading = ref(true)
      const filterStatus = ref('all')
      const showUrgentOnly = ref(false)
      const showDeleteModal = ref(false)
      const showPreviewModal = ref(false)
      const requestToDelete = ref(null)
      const currentPreviewUrl = ref('')
      const currentPreviewName = ref('')
  
      // Chargement initial
      onMounted(async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 800))
          isLoading.value = false
        } catch (error) {
          console.error("Erreur de chargement:", error)
          isLoading.value = false
        }
      })
  
      // Fonctions utilitaires
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
  
      const getTypeLabel = (type) => {
        const types = {
          certificate: 'Certificat',
          authorization: 'Autorisation',
          information: 'Information',
          other: 'Autre'
        }
        return types[type] || type
      }
  
      const getStatusLabel = (status) => {
        const statuses = {
          pending: 'En attente',
          approved: 'Approuvé',
          rejected: 'Rejeté'
        }
        return statuses[status] || status
      }
  
      // Filtrage
      const toggleUrgentOnly = () => {
        showUrgentOnly.value = !showUrgentOnly.value
      }
  
      const filteredRequests = computed(() => {
        return requestsStore.requests
          .filter(request => {
            if (filterStatus.value !== 'all' && request.status !== filterStatus.value) {
              return false
            }
            if (showUrgentOnly.value && !request.isUrgent) {
              return false
            }
            return true
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      })
  
      // Actions sur les demandes
      const updateRequestStatus = (id, status) => {
        requestsStore.updateRequestStatus(id, status)
      }
  
      const editRequest = (request) => {
        emit('edit-request', request)
      }
  
      // Gestion de la suppression
      const confirmDelete = (id) => {
        requestToDelete.value = id
        showDeleteModal.value = true
      }
  
      const cancelDelete = () => {
        requestToDelete.value = null
        showDeleteModal.value = false
      }
  
      const deleteRequest = () => {
        if (requestToDelete.value) {
          requestsStore.deleteRequest(requestToDelete.value)
          showDeleteModal.value = false
          requestToDelete.value = null
        }
      }
  
      // Gestion des fichiers
      const previewFile = (url) => {
        if (!url) return
        currentPreviewUrl.value = url
        showPreviewModal.value = true
      }
  
      const closePreview = () => {
        showPreviewModal.value = false
        currentPreviewUrl.value = ''
        currentPreviewName.value = ''
      }
  
      const downloadFile = (url, filename) => {
        if (!url) return
        const link = document.createElement('a')
        link.href = url
        link.download = filename || 'document'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
  
      const downloadCurrentPreview = () => {
        if (currentPreviewUrl.value) {
          downloadFile(currentPreviewUrl.value, currentPreviewName.value)
        }
      }
  
      return {
        isLoading,
        filterStatus,
        showUrgentOnly,
        showDeleteModal,
        showPreviewModal,
        requestToDelete,
        currentPreviewUrl,
        currentPreviewName,
        filteredRequests,
        formatDate,
        getTypeLabel,
        getStatusLabel,
        toggleUrgentOnly,
        updateRequestStatus,
        editRequest,
        confirmDelete,
        cancelDelete,
        deleteRequest,
        previewFile,
        closePreview,
        downloadFile,
        downloadCurrentPreview
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-request-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .filters select, .filters button {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  
  .filters button.active {
    background-color: #ff6b6b;
    color: white;
    border-color: #ff6b6b;
  }
  
  .requests-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .request-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background-color: white;
  }
  
  .request-card.pending {
    border-left: 4px solid #ffc107;
  }
  
  .request-card.approved {
    border-left: 4px solid #28a745;
  }
  
  .request-card.rejected {
    border-left: 4px solid #dc3545;
  }
  
  .request-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  
  .request-header h3 {
    margin: 0;
    flex-grow: 1;
  }
  
  .status-badge {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .request-card.pending .status-badge {
    background-color: #ffc107;
    color: #333;
  }
  
  .request-card.approved .status-badge {
    background-color: #28a745;
    color: white;
  }
  
  .request-card.rejected .status-badge {
    background-color: #dc3545;
    color: white;
  }
  
  .urgent-badge {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    background-color: #dc3545;
    color: white;
  }
  
  .request-body {
    margin-bottom: 10px;
  }
  
  .file-action {
    margin-left: 10px;
    padding: 2px 6px;
    background-color: #f0f0f0;
    border-radius: 4px;
    text-decoration: none;
    color: #333;
    font-size: 12px;
  }
  
  .file-action:hover {
    background-color: #e0e0e0;
  }
  
  .request-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  
  .approve-btn {
    background-color: #28a745;
    color: white;
  }
  
  .approve-btn:hover {
    background-color: #218838;
  }
  
  .reject-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .reject-btn:hover {
    background-color: #c82333;
  }
  
  .edit-btn {
    background-color: #17a2b8;
    color: white;
  }
  
  .edit-btn:hover {
    background-color: #138496;
  }
  
  .delete-btn {
    background-color: #6c757d;
    color: white;
  }
  
  .delete-btn:hover {
    background-color: #5a6268;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
  }
  
  .modal h3 {
    margin-bottom: 15px;
    color: #333;
  }
  
  .modal p {
    margin-bottom: 20px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .confirm-delete-btn {
    background-color: #dc3545;
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .confirm-delete-btn:hover {
    background-color: #c82333;
  }
  
  .cancel-delete-btn {
    background-color: #6c757d;
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-delete-btn:hover {
    background-color: #5a6268;
  }
  
  .no-requests {
    text-align: center;
    padding: 20px;
    color: #666;
    border: 1px dashed #ddd;
    border-radius: 8px;
  }
  </style>