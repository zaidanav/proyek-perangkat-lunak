<!-- MainLayout.vue -->
<template>
    <div class="min-h-screen flex flex-col">
      <Navbar />
      <main class="flex-1">
        <slot></slot>
      </main>

    </div>
  </template>
  
  <script setup lang="ts">
  import Navbar from '@/components/Navbar.vue';
  </script>