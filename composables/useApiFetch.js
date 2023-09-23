export const useApiFetch = async (path, query) => {
  const queryParam = query ? {
    sort: query.sort,
    descending: query.descending,
    page: query.page,
    per_page: query.per_page,
    min_year: query.min_year,
    max_year: query.max_year,
    min_rating: query.min_rating,
    max_rating: query.max_rating,
    min_vote_count: query.min_vote_count
  } : {}

  const config = useRuntimeConfig()
  const response = await useFetch(path, {
    baseURL: config.public.baseURL,
    query: queryParam
  })
  return response
}
