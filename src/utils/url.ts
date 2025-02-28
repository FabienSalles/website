const getSiteUrl = () => {
  console.log(import.meta.env);

  return import.meta.env.DEV
    ? "http://localhost:4321"
    : import.meta.env.SITE;
}
const generateUrl = (path: string) => {
  return getSiteUrl() + path;
}

export default generateUrl;