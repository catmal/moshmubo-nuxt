<script setup>
import { ref, onMounted } from 'vue'
import { useMovieStore } from '~/stores/movie'
import { storeToRefs } from 'pinia'
const { pagination, filters, genres } = storeToRefs(useMovieStore())

const year = ref({ min: 1920, max: 2024 })
const rating = ref({ min: 0, max: 10 })
const voteCount = ref(200)
const language = ref('en-US')
const selected = ref(null)

const { loadMovies, loadGenres } = useMovieStore()

async function request () {
  filters.value.voteCountMin = voteCount.value
  filters.value.yearMin = year.value.min
  filters.value.yearMax = year.value.max
  filters.value.ratingMin = rating.value.min
  filters.value.ratingMax = rating.value.max
  filters.value.genres = selected.value ? selected.value.map(i => i.tmdb_id) : ''
  await loadMovies({
    pagination: pagination.value,
    search: '',
    language: language.value
  })
}

onMounted(async () => {
  await loadGenres()
})

</script>
<template>
  <q-scroll-area
    class="fit"
    :horizontal-thumb-style="{ opacity: 0 }"
  >
    <q-list padding>
      <q-item
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-icon name="today" />
        </q-item-section>

        <q-item-section>
          Year
          <q-range
            v-model="year"
            :min="1920"
            :max="2023"
            label
            switch-label-side
            bounce="800"
          />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-icon name="star" />
        </q-item-section>
        <q-item-section>
          Rating
          <q-range
            v-model="rating"
            :min="0"
            :max="10"
            @change="request"
            marker-labels
            switch-marker-labels-side
          />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-icon name="group" />
        </q-item-section>
        <q-item-section>
          Min. Vote Count <q-slider
            v-model="voteCount"
            :min="0"
            :max="1000"
            label
            switch-label-side
            @change="request"
          />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-icon name="category" />
        </q-item-section>

        <q-item-section>
          <q-select
            label="Genres"
            v-model="selected"
            use-chips
            multiple
            input-debounce="0"
            :options="genres"
            option-label="name"
            @update:model-value="request"
          />
        </q-item-section>
      </q-item>
      <q-separator />
    </q-list>
  </q-scroll-area>
</template>

<!-- <template>
  <q-card-section>
    <p class="text-bold">
      FILTERS
    </p>
  </q-card-section>
  <q-card-section horizontal>
    <q-card-section>
      <q-badge>
        <p><strong>{{ year.min }} - {{ year.max }}</strong></p>
      </q-badge>
    </q-card-section>
    <q-card-section>
      <caption>Year</caption>
      <q-range
        v-model="year"
        :min="1920"
        :max="2023"
        label
        switch-label-side
        bounce="800"
      />
    </q-card-section>
  </q-card-section>
  <q-card-section
    horizontal
    class="full-wodth"
  >
    <q-card-section>
      Rating
      {{ rating }}
    </q-card-section>
    <q-card-section>
      <caption>Rating</caption>
      <q-range
        v-model="rating"
        :min="0"
        :max="10"
        @change="request"
        marker-labels
        switch-marker-labels-side
      />
    </q-card-section>
  </q-card-section>
  <q-card-section>
    <caption class="full-width text-left">
      Min Vote Count
    </caption>
    <q-slider
      v-model="voteCount"
      :min="0"
      :max="1000"
      label
      switch-label-side
      @change="request"
    />
  </q-card-section>
  <q-card-section>
    <q-select
      label="Genres"
      v-model="selected"
      use-chips
      multiple
      input-debounce="0"
      :options="genres"
      option-label="name"
      @update:model-value="request"
    />
  </q-card-section>
</template> -->
