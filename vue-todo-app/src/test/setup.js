// Test setup file for Vitest
import { vi } from 'vitest'

// Mock global objects that might not be available in test environment
global.fetch = vi.fn()

// Mock console methods if needed
// global.console = {
//   ...console,
//   // Uncomment to suppress console logs during tests
//   // log: vi.fn(),
//   // debug: vi.fn(),
//   // info: vi.fn(),
//   // warn: vi.fn(),
//   // error: vi.fn(),
// }
