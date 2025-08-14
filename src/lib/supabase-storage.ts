/**
 * Utility functions for Supabase Storage URLs
 */

const SUPABASE_URL = 'https://xtailgacbmhdtdxnqjdv.supabase.co';

/**
 * Generate a public URL for a file in Supabase Storage
 * @param bucketName - The name of the storage bucket
 * @param filePath - The path to the file within the bucket
 * @returns The public URL for the file
 */
export const getStorageUrl = (bucketName: string, filePath: string): string => {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${filePath}`;
};

/**
 * Generate URLs for common media files
 */
export const mediaUrls = {
  heroVideo: getStorageUrl('media', 'ark-warrior.mp4'),
  heroBackground: getStorageUrl('media', 'ark-warrior.jpeg'),
  mainBackground: getStorageUrl('media', 'images/main-background.jpg'),
  favicon: getStorageUrl('media', 'icons/favicon.png'),
  opengraph: getStorageUrl('media', 'images/opengraph.png'),
} as const;