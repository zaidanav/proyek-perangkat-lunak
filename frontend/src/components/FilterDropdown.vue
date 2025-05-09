<script setup lang="ts">
import { ref } from 'vue';

const selectedRole = ref('');
const emit = defineEmits<{
  (e: 'filter', role: string): void;
}>();

const onFilterChange = () => {
  emit('filter', selectedRole.value);
};
</script>

<template>
  <div class="filter-dropdown">
    <label for="role-filter">Filter by Role:</label>
    <select id="role-filter" v-model="selectedRole" @change="onFilterChange">
      <option value="">All</option>
      <option value="admin">Admin</option>
      <option value="trainer">Trainer</option>
      <option value="member">Member</option>
    </select>
  </div>
</template>

<style scoped>
.filter-dropdown {
  margin-bottom: 10px;
}
select {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>