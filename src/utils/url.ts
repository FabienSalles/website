const getSiteUrl = () => {
  return import.meta.env.DEV
    ? "http://localhost:4321"
    : import.meta.env.SITE;
}

const ensureTrailingSlash = (path: string) => {
  return path.endsWith("/") ? path : path + "/";
}
const generateUrl = (path: string) => {
  return getSiteUrl() + ensureTrailingSlash(path);
}

export default generateUrl;