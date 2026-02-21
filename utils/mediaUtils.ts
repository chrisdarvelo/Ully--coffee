import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Validates that a base64 image string doesn't exceed the size cap.
 */
export function validateImageSize(base64Data: string): void {
  const estimatedBytes = (base64Data.length * 3) / 4;
  if (estimatedBytes > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image is too large. Please use an image under 5MB.');
  }
}

/**
 * Extract evenly-spaced frames from a video and return as base64 strings.
 */
export async function extractFrames(videoUri: string, count = 5, durationMs = 10000): Promise<string[]> {
  const frames: string[] = [];
  for (let i = 0; i < count; i++) {
    const time = Math.round((i / (count - 1)) * durationMs);
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time,
        quality: 0.7,
      });
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      frames.push(base64);
    } catch {
      // skip frames that fail (e.g. past end of video)
    }
  }
  return frames;
}
