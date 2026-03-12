const ensureTrailingSlash = (path: string) => {
  return path.endsWith("/") ? path : path + "/";
}

const generateUrl = (path: string) => {
  return import.meta.env.DEV
    ? ensureTrailingSlash(path)
    : import.meta.env.SITE + ensureTrailingSlash(path);
}

export default generateUrl;