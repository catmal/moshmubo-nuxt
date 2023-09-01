<template>
    <NuxtLink :to="link">

  <q-item
    v-if="props.title"
    clickable
    
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon
        color="primary"
        :name="icon"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        <div class="text-bold text-white">
          {{ title }}
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</NuxtLink>

</template>

<script setup lang="ts">
const props = defineProps(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    icon: { type: String, required: true }

  }
)

</script>
