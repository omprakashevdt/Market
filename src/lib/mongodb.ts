// Decoupled Standalone Mode: No external MongoDB required for Vercel deployment
export async function connectDB(): Promise<null> {
  return null;
}
