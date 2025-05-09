<template>
  <div
    :class="['palette-container', modeClass, semanticColorModeClass]"
    ref="draggableWindow"
    class="draggable-window"
    :style="windowStyle"
    @mousedown="startDrag"
  >
    <h1>Color Palette Test</h1>
    <div class="palette">
      <!-- Default Color Palette -->
      <template v-if="!isSemanticColorMode">
        <div class="color-box" v-for="(color, name) in defaultColors" :key="name">
          <div :style="{ backgroundColor: color }" class="color-display"></div>
          <p class="color-name">{{ name }}</p>
          <p class="color-code">{{ color }}</p>
        </div>
      </template>

      <!-- Semantic Color Palette -->
      <template v-if="isSemanticColorMode">
        <div class="color-box" v-for="(color, name) in semanticColors" :key="name">
          <div :style="{ backgroundColor: color }" class="color-display"></div>
          <p class="color-name">{{ name }}</p>
          <p class="color-code">{{ color }}</p>
        </div>
      </template>
    </div>
    <button @click="toggleColorMode" class="color-mode-toggle">
      Switch to {{ isSemanticColorMode ? 'Default' : 'Semantic' }} Color Mode
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// For managing the window drag functionality
const draggableWindow = ref<HTMLElement | null>(null);
import type { CSSProperties } from 'vue';

const windowStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '50px',
  left: '50px',
});

let offsetX = 0;
let offsetY = 0;
let isDragging = false;

const isSemanticColorMode = ref(false); // Reactive state to track color mode

const modeClass = computed(() => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode';
});

const semanticColorModeClass = computed(() => {
  return isSemanticColorMode.value ? 'semantic-color-mode' : '';
});

const toggleColorMode = () => {
  isSemanticColorMode.value = !isSemanticColorMode.value;
};

// Default colors
const defaultColors = computed(() => ({
  "Primary Blue": "var(--vt-c-primary-blue)",
  "Secondary Green": "var(--vt-c-secondary-green)",
  "White": "var(--vt-c-white)",
  "Soft White": "var(--vt-c-white-soft)",
  "Mute White": "var(--vt-c-white-mute)",
  "Black": "var(--vt-c-black)",
  "Soft Black": "var(--vt-c-black-soft)",
  "Mute Black": "var(--vt-c-black-mute)",
  "Text Light": "var(--vt-c-text-light-1)",
  "Text Dark": "var(--vt-c-text-dark-1)",
  "Divider Light 1": "var(--vt-c-divider-light-1)",
  "Divider Dark 1": "var(--vt-c-divider-dark-1)",
  "Divider Light 2": "var(--vt-c-divider-light-2)",
  "Divider Dark 2": "var(--vt-c-divider-dark-2)",
}));

// Semantic colors
const semanticColors = computed(() => ({
  "Background": "var(--color-background)",
  "Background Soft": "var(--color-background-soft)",
  "Background Mute": "var(--color-background-mute)",
  "Text": "var(--color-text)",
  "Heading": "var(--color-heading)",
  "Border": "var(--color-border)",
  "Border Hover": "var(--color-border-hover)",
  "Section Gap": "var(--section-gap)",
}));

// Start dragging
const startDrag = (e: MouseEvent) => {
  isDragging = true;
  if (draggableWindow.value) {
    offsetX = e.clientX - draggableWindow.value.getBoundingClientRect().left;
    offsetY = e.clientY - draggableWindow.value.getBoundingClientRect().top;
  }

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

// Drag the window
const onDrag = (e: MouseEvent) => {
  if (isDragging) {
    windowStyle.value.top = `${e.clientY - offsetY}px`;
    windowStyle.value.left = `${e.clientX - offsetX}px`;
  }
};

// Stop dragging
const stopDrag = () => {
  isDragging = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};
</script>

<style scoped>
.palette-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: var(--color-background);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.palette {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 1000px;
}

.color-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.color-display {
  width: 100%;
  height: 100px;
  border-radius: 5px;
}

.color-name {
  margin-top: 10px;
  font-weight: bold;
}

.color-code {
  margin-top: 5px;
  font-size: 12px;
  color: #555;
}

.light-mode {
  background-color: var(--color-background);
  color: var(--color-text);
}

.dark-mode {
  background-color: var(--color-background);
  color: var(--color-text);
}

.draggable-window {
  cursor: grab;
  max-width: 90%;
  top: 50px;
  left: 50px;
  position: absolute;
  z-index: 9999;
}

.color-mode-toggle {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--vt-c-primary-blue);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.color-mode-toggle:hover {
  background-color: var(--vt-c-primary-blue);
  opacity: 0.8;
}

/* Semantic Mode Styles */
.semantic-color-mode {
  background-color: var(--color-background);
  color: var(--color-text);
}
</style>