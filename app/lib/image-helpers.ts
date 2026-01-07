export function getPosterUrl(posterPath: string | null, size: "w300" | "w500" | "original" = "w500"): string | null {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

export function getBackdropUrl(backdropPath: string | null, size: "w780" | "w1280" | "original" = "w1280"): string | null {
  if (!backdropPath) return null;
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
}

export function getProviderLogoUrl(logoPath: string, size: "w45" | "w92" | "w154" | "original" = "w92"): string {
  return `https://image.tmdb.org/t/p/${size}${logoPath}`;
}

