<template>
  <q-icon
    v-if="props.asc"
    name="arrow_upward"
    size="sm"
  />
  <q-icon
    v-if="!props.asc"
    name="arrow_downward"
    size="sm"
  />
</template>

<script setup lang="ts">
const props = defineProps(
  {
    asc: { type: Boolean, required: true }
  }
)
</script>
