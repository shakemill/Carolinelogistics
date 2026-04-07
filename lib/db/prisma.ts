import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// Parse DATABASE_URL to extract connection details
function parseDatabaseUrl(url: string) {
  try {
    // Handle mysql:// format
    const match = url.match(/^mysql:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)$/)
    if (match) {
      const [, user, password, host, port, database] = match
      return {
        host,
        port: parseInt(port) || 3306,
        user,
        password: password || undefined,
        database: database.split('?')[0], // Remove query params
      }
    }
    
    // Fallback: try URL parsing
    const urlObj = new URL(url.replace('mysql://', 'http://'))
    return {
      host: urlObj.hostname,
      port: parseInt(urlObj.port) || 3306,
      user: urlObj.username || undefined,
      password: urlObj.password || undefined,
      database: urlObj.pathname.replace('/', '').split('?')[0],
    }
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${url}. Error: ${error}`)
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Get DATABASE_URL from environment
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in environment variables')
}

// Parse connection details
let connectionDetails
try {
  connectionDetails = parseDatabaseUrl(databaseUrl)
} catch (error: any) {
  console.error('Error parsing DATABASE_URL:', error.message)
  throw error
}

// Create adapter with connection details
const adapterConfig: any = {
  host: connectionDetails.host,
  port: connectionDetails.port,
  user: connectionDetails.user,
  database: connectionDetails.database,
  connectionLimit: 10,
}

// Only add password if it exists
if (connectionDetails.password) {
  adapterConfig.password = connectionDetails.password
}

let adapter
try {
  adapter = new PrismaMariaDb(adapterConfig)
} catch (error: any) {
  console.error('Error creating Prisma adapter:', error.message)
  throw error
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
