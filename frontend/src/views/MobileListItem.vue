<script lang="ts" setup>
    const emit = defineEmits(['click']);
</script>

<template>
    <tr class="mobile_item" @click="emit('click')">

        <td class="primary">
            <slot name="main">
                Name
            </slot>
            <section class="mini-text">
                <slot name="sub">
                    Sub
                </slot>
            </section>
        </td>
        <!-- Slots for optional tags -->
        <td v-if="$slots.x1"><slot name="x1"/></td>
        <td v-if="$slots.x2"><slot name="x2"/></td>
        <td v-if="$slots.x3"><slot name="x3"/></td>
    </tr>
</template>

<style scoped>
.mobile_item {
    height: 4rem;
    border: 2px solid red;
    margin: 0.5rem 0px;
    display: grid;
    grid-auto-flow: column;
    width: 100%;
    grid-template-columns: 4fr;
    grid-auto-columns: 1fr;
}

td {
    flex-grow: 0.5;
    text-align: center;
    float: inline-start;
}

td:not(.primary) {
    padding-left: 0.125rem;
    margin-left: 0.125rem;
    border-left: 1px solid red;
}

td #text {
    max-height: 0.1rem;
    
}

.mini-text {
    display: block;
    font-size: 1rem;
    line-height: 1rem;
    margin-top: 0.1rem;
}


.primary {
    flex-grow: 2;
    text-align: start;
    padding-left: 1rem;
    font-weight: bold;
    font-size: 1.25rem
}

td label {
    display: block;
    font-size: 0.75rem;
    font-weight: bold;
}
</style>