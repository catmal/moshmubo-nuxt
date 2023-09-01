export const useApiFetch = (path, options) => {
  console.log(options)
  const config = useRuntimeConfig()
  console.log(config.public.baseUrl)
  return useFetch(path, { baseURL: config.public.baseURL, ...options })
}
