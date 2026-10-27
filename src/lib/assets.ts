/** Resolves public files beneath Vite's deployment base, including project Pages sites. */
export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
