import { createClient } from "next-sanity"

// Sanity projectId must only contain a-z, 0-9, and dashes
function sanitizeProjectId(id: string): string {
  const sanitized = id?.toString().toLowerCase().replace(/[^a-z0-9-]/g, "")
  if (!sanitized) {
    throw new Error("Invalid projectId after sanitization.")
  }
  return sanitized
}

// Sanity dataset must only contain lowercase characters, numbers, underscores and dashes
function sanitizeDataset(ds: string): string {
  const sanitized = ds?.toString().toLowerCase().replace(/[^a-z0-9_-]/g, "")
  if (!sanitized) {
    throw new Error("Invalid dataset after sanitization.")
  }
  return sanitized
}

// Get environment variables with valid fallbacks
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "demo-project"
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-06-01"

// Check if we have a real project ID (not the fallback)
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn("⚠️ NEXT_PUBLIC_SANITY_PROJECT_ID not set. Using demo project. Please add your Sanity project ID to .env.local")
}

export const client = createClient({
  projectId: sanitizeProjectId(projectId),
  dataset: sanitizeDataset(dataset),
  apiVersion,
  useCdn: true, // set to `false` if you want to ensure fresh data
})
