export function isPreviewTestEnvironment() {
  return process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development'
}
