<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
import { defineAsyncComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

</script>
<template>
  <div>
    <NuxtLayout>
      <div
        class="q-ma-md transparent1"
        style="width: 200px"
      >
        <q-card-section>
          <q-separator class="q-my-md" />
          <div class="text-center">
            <h3 class="text-white text-primary q-my-md">MOSHMUBO</h3>
            <AuthSocialLogin  />
          </div>
        </q-card-section>
      </div>
    </NuxtLayout>
  </div>
</template>

<style lang="scss" scoped>
.transparent1 {
  opacity: 0.95;
}
</style>
