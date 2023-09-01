<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { useMovieStore } from '~/stores/movie'
import { storeToRefs } from 'pinia'
const { pagination, filters } = storeToRefs(useMovieStore())

const sortBy = ref('primary_release_date.')
const sortAsc = ref(false)

const { loadMovies } = useMovieStore()

async function request () {
  const direction = sortAsc.value ? 'asc' : 'desc'
  filters.value.sortString = sortBy.value + direction
  await loadMovies({
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
        @click="sort('primary_release_date.')"
        style="width: 100%"
        icon="calendar_month"
        :class="{ 'bg-primary text-white': currentSortBy('primary_release_date.'), 'bg-black text-white': !currentSortBy('primary_release_date.') }"
      >
        <SharedSortingArrow
          :asc="sortAsc"
          v-if="currentSortBy('primary_release_date.')"
        />
      </q-btn>
    </div>
    <div class="col-3">
      <q-btn
        icon="star"
        style="width: 100%"
        @click="sort('vote_average.')"
        :class="{ 'bg-primary text-white': currentSortBy('vote_average.'), 'bg-black text-white': !currentSortBy('vote_average.') }"
      >
        <SharedSortingArrow
          :asc="sortAsc"
          v-if="sortBy === 'vote_average.'"
        />
      </q-btn>
    </div>
    <div class="col-3">
      <q-btn
        icon="mood"
        @click="sort('popularity.')"
        style="width: 100%"
        :class="{ 'bg-primary text-white': currentSortBy('popularity.'), 'bg-black text-white': !currentSortBy('popularity.') }"
      >
        <SharedSortingArrow
          :asc="sortAsc"
          v-if="sortBy === 'popularity.'"
        />
      </q-btn>
    </div>
    <div class="col-3">
      <q-btn
        icon="group"
        @click="sort('vote_count.')"
        style="width: 100%"
        :class="{ 'bg-primary text-white': currentSortBy('vote_count.'), 'bg-black text-white': !currentSortBy('vote_count.') }"
      >
        <SharedSortingArrow
          :asc="sortAsc"
          v-if="sortBy === 'vote_count.'"
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
