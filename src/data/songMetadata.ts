export interface SongMetadata {
  title: string;
  singer?: string;
  artist?: string;
}

// Map YouTube video IDs to their actual song metadata
// This allows us to override generic YouTube channel names with the actual artists
export const songMetadataOverride: Record<string, SongMetadata> = {
  // Example entry:
  // "dQw4w9WgXcQ": {
  //   title: "Never Gonna Give You Up",
  //   singer: "Rick Astley",
  //   artist: "Rick Astley",
  // },
};
