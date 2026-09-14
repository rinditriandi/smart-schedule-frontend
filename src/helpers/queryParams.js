export default ({ path, key }) => {
  const queryParams = new URLSearchParams(path)
  return queryParams.get(key)
}