<script setup>
import { ref } from 'vue'
import { useMovieStore } from '~/stores/movie'
import { storeToRefs } from 'pinia'
const emit = defineEmits(['sort'])

const { pagination, filters } = storeToRefs(useMovieStore())

const sortBy = ref('primary_release_date.')
const sortAsc = ref(false)

const { loadUserMovies } = useMovieStore()

async function request () {
  await loadUserMovies({
    pagination: pagination.value,
    search: ''
  })
}
async function sort (payload) {
  if (payload === sortBy.value) {
    sortAsc.value = !sortAsc.value
  }
  sortBy.value = payload
  await request()
}

function currentSortBy (payload) {
  return sortBy.value === payload
}

</script>

<template>
  <div class="row q-col-gutter-sm q-px-sm q-py-sm">
    <div class="col-3">
      <q-btn
        @click="sort('release_date')"
        style="width: 100%"
        icon="calendar_month"
        :class="{ 'bg-primary text-white': currentSortBy('release_date'), 'bg-black text-white': !currentSortBy('primary_release_date.') }"
      >
        <SharedSortingArrow
          :asc="sortAsc"
          v-if="currentSortBy('release_date')"
        />
      </q-btn>
    </div>
    <div class="col-3">
      <q-btn
        icon="star"
        style="width: 100%"
        @click="emit('sort', 'rating')"
        :class="{ 'bg-primary text-white': currentSortBy('rating'), 'bg-black text-white': !currentSortBy('vote_average.') }"
      >
        <SharedSortingArrow
          :asc="sortAsc"
          v-if="sortBy === 'rating.'"
        />
      </q-btn>
    </div>
    <div class="col-3">
      <q-btn
        icon="mood"
        @click="emit('sort', 'popularity)')"
        style="width: 100%"
        :class="{ 'bg-primary text-white': currentSortBy('popularity.'), 'bg-black text-white': !currentSortBy('popularity.') }"
      >
        <SharedSortingArrow
          :asc="sortAsc"
          v-if="sortBy === 'popularity'"
        />
      </q-btn>
    </div>
    <div class="col-3">
      <q-btn
        icon="group"
        @click="emit('sort', 'vote_count)')"
        style="width: 100%"
        :class="{ 'bg-primary text-white': currentSortBy('vote_count'), 'bg-black text-white': !currentSortBy('vote_count') }"
      >
        <SharedSortingArrow
          :asc="sortAsc"
          v-if="sortBy === 'vote_count'"
        />
      </q-btn>
    </div>
  </div>
</template>

<style scoped>
btn {
  width: fit-content;

}
</style>
