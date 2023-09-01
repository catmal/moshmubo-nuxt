<script lang="ts">
export default {
  name: 'TextInput'

}
</script>
<script setup lang="ts">

const emit = defineEmits(['input'])
const props = defineProps(
  {
    value: { type: String, required: false, default: '' },
    hint: { type: String, required: false, default: '' },
    number: { type: Boolean, required: false },
    icon: { type: String, required: false, default: null },
    badge: { type: String, required: false, default: null },
    rules: { type: Array, required: false, default: null },
    currency: { type: Boolean, required: false, default: false },
    disable: { type: Boolean, required: false }
  }
)
</script>
<template>
  <q-input
    v-if="!props.number"
    :disable="props.disable"
    outlined
    type="text"
    debounce="500"
    :model-value="props.value"
    v-bind="$attrs"
    :label="props.hint"
    :rules="props.rules"
    @update:model-value="emit('input', $event)"
  >
    <template #prepend>
      <q-icon
        v-if="props.icon"
        size="sm"
        :name="props.icon"
        color="primary"
      />
      <q-badge
        v-if="props.badge"
        class="q-pa-sm"
        size="md"
        color="primary"
      >
        <p class="text-bold text-white text-center">
          {{ props.badge }}
        </p>
      </q-badge>
    </template>
  </q-input>
</template>
