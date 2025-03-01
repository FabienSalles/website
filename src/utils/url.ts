const getSiteUrl = () => {
  return import.meta.env.DEV
    ? "http://localhost:4321"
    : import.meta.env.SITE;
}
const generateUrl = (path: string) => {
  return getSiteUrl() + path;
}

export default generateUrl;