type ImageVariant = "public";

export const CLOUDFLARE_IMAGE_BASE_URL = "https://imagedelivery.net/dW-3K58n-xMPDWr853fUIA";

export const cloudflareImageURL = (id: string) => `${CLOUDFLARE_IMAGE_BASE_URL}/${id}`;

export const cloudflareImageVariantURL = (url: string, variant: ImageVariant = "public") => `${url}/${variant}`;
