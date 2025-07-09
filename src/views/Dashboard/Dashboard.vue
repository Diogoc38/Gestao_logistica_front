<template>
  <div class="dashboard-layout">
    <Sidebar :collapsed="collapsed" @toggle="collapsed = !collapsed" />

    <main class="dashboard-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<style src="@/assets/styles/dashboard_css/dashboard.css"></style>