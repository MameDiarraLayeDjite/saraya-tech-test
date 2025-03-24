<template>
    <div class="request-form-container">
      <div class="request-form">
        <h2 class="form-title">
          {{ editing ? 'Modifier la demande' : 'Nouvelle demande administrative' }}
        </h2>
        
        <form @submit.prevent="handleSubmit" class="form-content">
          <!-- Nom complet -->
          <div class="form-group">
            <label for="fullName" class="form-label">Nom complet <span class="required">*</span></label>
            <input
              id="fullName"
              v-model="formData.fullName"
              type="text"
              required
              class="form-input"
              placeholder="Votre nom complet"
            >
          </div>
  
          <!-- Type de demande -->
          <div class="form-group">
            <label for="requestType" class="form-label">Type de demande <span class="required">*</span></label>
            <div class="select-wrapper">
              <select 
                id="requestType" 
                v-model="formData.type" 
                required
                class="form-input"
              >
                <option value="" disabled>Sélectionnez un type</option>
                <option value="certificate">Certificat</option>
                <option value="authorization">Autorisation</option>
                <option value="information">Information</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
          
          <!-- Description -->
          <div class="form-group">
            <label for="description" class="form-label">Description <span class="required">*</span></label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              required
              class="form-input form-textarea"
              placeholder="Décrivez votre demande en détail..."
            ></textarea>
            <span class="char-count" :class="{ 'char-count-warning': formData.description.length > 200 }">
              {{ formData.description.length }}/300 caractères
            </span>
          </div>
          
          <!-- Pièce jointe -->
          <div class="form-group">
            <label for="attachment" class="form-label">Pièce jointe (optionnelle)</label>
            <div class="file-upload-container">
              <label for="attachment" class="file-upload-label">
                <span class="file-icon">📎</span>
                <span>{{ formData.attachmentName || 'Choisir un fichier' }}</span>
              </label>
              <input 
                type="file" 
                id="attachment" 
                @change="handleFileUpload"
                class="file-input"
              >
            </div>
            <div v-if="formData.attachmentName" class="file-preview">
              <span class="file-name">{{ formData.attachmentName }}</span>
              <button type="button" class="remove-file" @click="removeFile">
                &times;
              </button>
            </div>
          </div>
          
          <!-- Urgence -->
          <div class="form-group checkbox-group">
            <label class="checkbox-container">
              <input type="checkbox" v-model="formData.isUrgent"> 
              <span class="checkbox-label">Demande urgente</span>
              <span class="checkbox-custom"></span>
            </label>
          </div>
          
          <!-- Boutons d'action -->
          <div class="form-actions">
            <button v-if="editing" type="button" class="btn btn-secondary" @click="cancelEdit">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary">
              {{ editing ? 'Mettre à jour' : 'Soumettre la demande' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  import { useRequestsStore } from '../stores/requests'
  
  export default {
    props: {
      editingRequest: {
        type: Object,
        default: null
      }
    },
    emits: ['cancel-edit'],
    setup(props, { emit }) {
      const requestsStore = useRequestsStore()
      const editing = ref(false)
      const formData = ref({
        id: '',
        fullName: '',
        type: '',
        description: '',
        attachment: null,
        attachmentName: '',
        attachmentUrl: '',
        isUrgent: false
      })
  
      const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
          formData.value.attachment = file
          formData.value.attachmentName = file.name
          formData.value.attachmentUrl = URL.createObjectURL(file)
        }
      }
  
      const removeFile = () => {
        formData.value.attachment = null
        formData.value.attachmentName = ''
        formData.value.attachmentUrl = ''
        const fileInput = document.getElementById('attachment')
        if (fileInput) fileInput.value = ''
      }
  
      watch(() => props.editingRequest, (newVal) => {
        if (newVal) {
          editing.value = true
          formData.value = {
            id: newVal.id,
            fullName: newVal.fullName || '',
            type: newVal.type,
            description: newVal.description,
            attachment: null,
            attachmentName: newVal.attachmentName || '',
            attachmentUrl: newVal.attachmentUrl || '',
            isUrgent: newVal.isUrgent || false
          }
        }
      }, { immediate: true })
  
      const handleSubmit = () => {
        const requestToSubmit = {
          fullName: formData.value.fullName,
          type: formData.value.type,
          description: formData.value.description,
          attachmentName: formData.value.attachmentName,
          attachmentUrl: formData.value.attachmentUrl,
          isUrgent: formData.value.isUrgent
        }
        
        if (editing.value) {
          requestsStore.updateRequest(formData.value.id, requestToSubmit)
        } else {
          requestsStore.addRequest(requestToSubmit)
        }
        
        resetForm()
        showNotification(editing.value ? 'Demande mise à jour avec succès!' : 'Votre demande a été soumise avec succès!')
      }
  
      const showNotification = (message) => {
        const notification = document.createElement('div')
        notification.className = 'notification'
        notification.textContent = message
        document.body.appendChild(notification)
        
        setTimeout(() => {
          notification.classList.add('show')
        }, 10)
        
        setTimeout(() => {
          notification.classList.remove('show')
          setTimeout(() => {
            document.body.removeChild(notification)
          }, 300)
        }, 3000)
      }
  
      const cancelEdit = () => {
        resetForm()
        emit('cancel-edit')
      }
  
      const resetForm = () => {
        formData.value = {
          id: '',
          fullName: '',
          type: '',
          description: '',
          attachment: null,
          attachmentName: '',
          attachmentUrl: '',
          isUrgent: false
        }
        editing.value = false
      }
  
      return {
        editing,
        formData,
        handleFileUpload,
        removeFile,
        handleSubmit,
        cancelEdit,
        resetForm
      }
    }
  }
  </script>

  <style scoped>
  .request-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="file"],
  select,
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  textarea {
    min-height: 100px;
  }
  
  .submit-btn {
    background-color: #42b983;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .submit-btn:hover {
    background-color: #369f6b;
  }
  </style>