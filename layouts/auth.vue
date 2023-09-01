
<template>
  <q-layout>
    <q-page-container :style="{backgroundImage:`url(${imageUrl})`}">
      <q-page class="flex flex-center ">
        <slot />
       </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import background from '~/assets/images/background.jpg'

const imageUrl = computed(() => {
  return background
})
</script>
