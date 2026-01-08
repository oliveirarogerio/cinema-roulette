"use server";

import axios from "axios";
import { PirateAPIResponse, TorrentResult } from "./types";

function getApiUrl(): string {
  const url = process.env.PIRATE_API_URL;
  if (!url) {
    return "https://thepirateapi.fly.dev";
  }
  return url;
}

async function searchTorrents(
  query: string,
  page: number = 1
): Promise<TorrentResult[]> {
  try {
    const apiUrl = getApiUrl();
    const response = await axios.get<PirateAPIResponse>(`${apiUrl}/search`, {
      params: {
        query,
        page,
      },
      timeout: 10000,
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error searching torrents:", error.message);
    }
    return [];
  }
}

function generateMagnetLink(torrent: TorrentResult): string {
  return torrent.torrentLink;
}

export async function searchMovieTorrent(
  movieTitle: string,
  year?: string
): Promise<Array<{ torrent: { name: string; seeders: number; leechers: number; size: string }; magnetLink: string }>> {
  const searchQuery = year ? `${movieTitle} ${year}` : movieTitle;
  const results = await searchTorrents(searchQuery);

  if (results.length === 0) {
    return [];
  }

  const torrentsWithMagnets = results
    .filter((torrent) => parseInt(torrent.seeders) > 0)
    .sort((a, b) => parseInt(b.seeders) - parseInt(a.seeders))
    .map((torrent) => ({
      torrent: {
        name: torrent.title,
        seeders: parseInt(torrent.seeders),
        leechers: parseInt(torrent.leechers),
        size: torrent.size,
      },
      magnetLink: generateMagnetLink(torrent),
    }));

  return torrentsWithMagnets;
}

