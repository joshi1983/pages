// copied from:
// https://www.delftstack.com/howto/javascript/javascript-random-seed-to-generate-random

// Define the Murmur3Hash function
export function murmurHash3(string) {
  let i = 0;
  let hash = 1779033703 ^ string.length;
  for (; i < string.length; i++) {
    let bitwise_xor_from_character = hash ^ string.charCodeAt(i);
    hash = Math.imul(bitwise_xor_from_character, 3432918353);
    hash = hash << 13 | hash >>> 19;
  }
  return () => {
    // Return the hash that you can use as a seed
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  }
};