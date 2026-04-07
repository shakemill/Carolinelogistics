import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate product URL using slug if available, otherwise fallback to ID
 */
export function getProductUrl(product: { id: string; slug?: string | null }): string {
  return `/boutique/${product.slug || product.id}`
}
