<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    currentPage: number;
    pageCount: number;
    maxPageDistance?: number;
}>(), {
    maxPageDistance: 2,
});

const emits = defineEmits<{
    goToPage: [pageNo: number];
}>();

const leftPages = computed(() => {
    const leftMost = Math.max(1, props.currentPage - props.maxPageDistance + 1);
    return Array.from({ length: Math.max(0, props.currentPage - leftMost + 1) }, (_, index) => leftMost + index);
});

const rightPages = computed(() => {
    const rightMost = Math.min(props.pageCount, props.currentPage + props.maxPageDistance + 1);
    return Array.from({ length: Math.max(0, rightMost - props.currentPage - 1) }, (_, index) => props.currentPage + 2 + index);
});
</script>

<template>
        <ul class="pagination">
            <li v-for="l_id in leftPages" :key="l_id" @click="() => emits('goToPage', l_id - 1)">
                {{ l_id }}
            </li>
            <li class="selected">
                {{ props.currentPage + 1 }}
            </li>
            <li v-for="r_id in rightPages" :key="r_id" @click="() => emits('goToPage', r_id - 1)">
                {{ r_id }}
            </li>
        </ul>
</template>

<style>
    li {
        border-radius: 10dvw;
        width: 3rem;
        margin: 0 1%;
        aspect-ratio: 1 / 1;
        background-color: var(--color-background-soft);
        cursor: pointer;
        border-color: var(--color-border);
        padding: 0.5rem;
        text-align: center;
        justify-items: end;
    }

    li:hover {
        background-color: var(--color-background-mute);
    }

    li.selected {
        background-color: var(--color-border);
        font-weight: bold;
        text-decoration: underline;
    }

    .pagination-container {
        display: flex;
        align-items: center;
        padding: 10px;
    }

    .pagination {
        display: flex;
        gap: 16px;
        list-style: none;
        padding: 4px;
        margin: 0;
        height: 100%;
    }
</style>