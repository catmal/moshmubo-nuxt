<script setup>
  const emit = defineEmits(['toggle_watched', 'toggle_watchlist'])
  const props = defineProps(
  {
    feedback: { type: Boolean, required: true }
  }
)

</script>
<template>
  <div class="row full-width q-gutter-sm q-px-sm items-center q-mb-sm">
    <q-space />
    <q-btn
      size="sm"
      icon="thumb_up"
      outline
      @click="emit('positive')"
      :color="props.feedback ? 'primary' : 'white'"
    />
    <q-btn
      size="sm"
      class="cursor-pointer"
      icon="thumb_down"
      outline
      @click="emit('negative')"
      :color="props.feedback === false ? 'primary' : 'white'"


    />
  </div>
</template>
