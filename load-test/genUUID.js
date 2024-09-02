// Check if we're in a Node.js environment
const isNode = typeof window === 'undefined';

// Use the appropriate crypto module
const crypto = isNode ? require('crypto') : window.crypto;

function generateUUID() {
  // Generate 16 random bytes
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Set the version (4) and variant (8, 9, A, or B) bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;  // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80;  // variant 10xx

  // Convert to hex string
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

  // Format as UUID
  return `${hex.substr(0,8)}-${hex.substr(8,4)}-${hex.substr(12,4)}-${hex.substr(16,4)}-${hex.substr(20)}`;
}

function generateUUIDArray(count) {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('Count must be a positive integer');
  }

  return Array.from({ length: count }, generateUUID);
}

// Example usage
const uuidCount = 100;
const uuidArray = generateUUIDArray(uuidCount);
console.log(uuidArray);