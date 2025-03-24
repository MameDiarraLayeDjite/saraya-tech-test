<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1>Gestion des demandes administratives</h1>
        <p class="subtitle">Système centralisé de suivi et traitement</p>
      </div>
    </header>
    
    <main>
      <div class="tabs-container">
        <div class="tabs">
          <button 
            @click="activeTab = 'form'"
            :class="{ active: activeTab === 'form' }"
            class="tab-button"
          >
            <span class="tab-icon">📝</span>
            Nouvelle demande
          </button>
          <button 
            @click="activeTab = 'admin'"
            :class="{ active: activeTab === 'admin' }"
            class="tab-button"
          >
            <span class="tab-icon">⚙️</span>
            Gestion des demandes
          </button>
        </div>
      </div>
      
      <div class="tab-content">
        <transition name="fade" mode="out-in">
          <RequestForm v-if="activeTab === 'form'" />
          <AdminRequestList v-else />
        </transition>
      </div>
    </main>
    
    <footer class="app-footer">
      <p>&copy; 2025 - Système de gestion des demandes administratives</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RequestForm from './components/RequestForm.vue'
import AdminRequestList from './components/AdminRequestList.vue'

const activeTab = ref('form') // 'form' ou 'admin'
</script>

<style>
:root {
  --primary-color: #3a6ea5;
  --primary-hover: #2c5282;
  --accent-color: #ff6b6b;
  --text-color: #333;
  --text-light: #6e6e6e;
  --background-color: #f8f9fa;
  --card-background: #ffffff;
  --border-radius: 8px;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
  margin-bottom: 30px;
  padding: 30px;
  color: white;
  box-shadow: var(--shadow);
}

.header-content {
  text-align: center;
}

.app-header h1 {
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-weight: 400;
  opacity: 0.9;
  font-size: 1.1rem;
}

.tabs-container {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.tabs {
  display: flex;
  gap: 15px;
  background-color: var(--card-background);
  padding: 10px;
  border-radius: 50px;
  box-shadow: var(--shadow);
}

.tab-button {
  padding: 12px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 30px;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);
  font-weight: 500;
}

.tab-button:hover {
  background-color: rgba(58, 110, 165, 0.1);
}

.tab-button.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-content {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 30px;
  flex-grow: 1;
}

.app-footer {
  margin-top: 40px;
  text-align: center;
  color: var(--text-light);
  font-size: 0.9rem;
  padding: 20px 0;
}

/* Animation de transition entre les onglets */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ajustements pour les écrans mobiles */
@media (max-width: 768px) {
  .tabs {
    width: 100%;
    flex-direction: column;
    border-radius: var(--border-radius);
    gap: 8px;
  }
  
  .tab-button {
    border-radius: var(--border-radius);
    justify-content: center;
  }
  
  .app-header {
    padding: 20px;
  }
  
  .tab-content {
    padding: 20px;
  }
}
</style>