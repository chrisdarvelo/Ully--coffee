import { validateImageSize, extractFrames } from '../../utils/mediaUtils';

const VideoThumbnails = require('expo-video-thumbnails');
const FileSystem = require('expo-file-system');

// ─── validateImageSize ───────────────────────────────────────────────────────
describe('validateImageSize', () => {
  // Threshold: (length * 3/4) > 5_242_880 bytes
  const MAX_BYTES = 5 * 1024 * 1024;

  it('does not throw for a small image', () => {
    const small = 'A'.repeat(100);
    expect(() => validateImageSize(small)).not.toThrow();
  });

  it('does not throw when decoded size is exactly at the limit', () => {
    // largest string that decodes to ≤ 5 MB
    const atLimit = 'A'.repeat(Math.floor(MAX_BYTES * (4 / 3)));
    expect(() => validateImageSize(atLimit)).not.toThrow();
  });

  it('throws when decoded size exceeds 5 MB', () => {
    // +1 byte over the decoded limit
    const over = 'A'.repeat(Math.floor(MAX_BYTES * (4 / 3)) + 4);
    expect(() => validateImageSize(over)).toThrow('too large');
  });

  it('throw message mentions 5MB', () => {
    const over = 'A'.repeat(Math.floor(MAX_BYTES * (4 / 3)) + 4);
    expect(() => validateImageSize(over)).toThrow('5MB');
  });
});

// ─── extractFrames ───────────────────────────────────────────────────────────
describe('extractFrames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    VideoThumbnails.getThumbnailAsync.mockResolvedValue({ uri: 'file://thumb.jpg' });
    FileSystem.readAsStringAsync.mockResolvedValue('base64frame');
  });

  it('returns one base64 string per requested frame', async () => {
    const frames = await extractFrames('video://test.mp4', 3, 6000);
    expect(frames).toHaveLength(3);
    expect(frames).toEqual(['base64frame', 'base64frame', 'base64frame']);
  });

  it('spaces timestamps evenly across the duration', async () => {
    await extractFrames('video://test.mp4', 3, 10000);
    expect(VideoThumbnails.getThumbnailAsync).toHaveBeenCalledWith(
      'video://test.mp4', { time: 0, quality: 0.7 }
    );
    expect(VideoThumbnails.getThumbnailAsync).toHaveBeenCalledWith(
      'video://test.mp4', { time: 5000, quality: 0.7 }
    );
    expect(VideoThumbnails.getThumbnailAsync).toHaveBeenCalledWith(
      'video://test.mp4', { time: 10000, quality: 0.7 }
    );
  });

  it('skips frames that fail and returns the rest', async () => {
    VideoThumbnails.getThumbnailAsync
      .mockRejectedValueOnce(new Error('decode failed'))
      .mockResolvedValue({ uri: 'file://thumb.jpg' });

    const frames = await extractFrames('video://test.mp4', 3, 6000);
    expect(frames).toHaveLength(2); // 1 failed, 2 succeeded
  });

  it('returns an empty array when every frame fails', async () => {
    VideoThumbnails.getThumbnailAsync.mockRejectedValue(new Error('fail'));
    const frames = await extractFrames('video://test.mp4', 5, 10000);
    expect(frames).toEqual([]);
  });

  it('defaults to 5 frames over 10 seconds', async () => {
    await extractFrames('video://test.mp4');
    expect(VideoThumbnails.getThumbnailAsync).toHaveBeenCalledTimes(5);
  });

  it('reads each thumbnail file as Base64', async () => {
    await extractFrames('video://test.mp4', 2, 4000);
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      'file://thumb.jpg',
      { encoding: FileSystem.EncodingType.Base64 }
    );
  });
});
