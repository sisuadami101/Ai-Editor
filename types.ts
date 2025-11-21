export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT_3_4 = "3:4",
  LANDSCAPE_4_3 = "4:3",
  PORTRAIT_9_16 = "9:16",
  LANDSCAPE_16_9 = "16:9"
}

export enum ImageSize {
  SIZE_1K = "1K",
  SIZE_2K = "2K",
  SIZE_4K = "4K"
}

export interface BannerRequest {
  description: string;
  targetUrl: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  aspectRatio: AspectRatio;
  timestamp: number;
}

export enum AppMode {
  BANNER_GEN = 'banner',
  BG_REMOVAL = 'bg_removal'
}

export interface BgRemovalItem {
  id: string;
  originalUrl: string;
  processedUrl: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  filename: string;
}