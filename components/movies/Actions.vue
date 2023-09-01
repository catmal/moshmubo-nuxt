<script setup>

const emit = defineEmits(['toggle_watched', 'toggle_watchlist'])

const props = defineProps(
  {
    watched: { type: Boolean, required: true },
    watchlist: { type: Boolean, required: true },
  }
)

</script>

<template>
    <q-icon
    name="visibility"
    size="md"
    :title="props.watched ? 'Watched' : 'Unwatched'"
    class="cursor-pointer"
    :color="props.watched ? 'positive' : 'white'"
    @click.native.stop="emit('toggle_watched')"
    />
    <q-icon
    name="bookmark"
    size="md"
    :title="props.watched ? 'Remove from Watchlist' : 'Add to Watchlist'"
    class="cursor-pointer"
    :color="props.watchlist ? 'positive' : 'white'"
    @click.native.stop="emit('toggle_watchlist')"
    />
    <q-icon
    name="download"
    size="md"
    title="Download"
    class="cursor-pointer"
    @click="request({pagination: pagination})"
    />
    <q-icon
    name="star"
    size="md"
    title="Put in rank"
    class="cursor-pointer"
    />
</template>