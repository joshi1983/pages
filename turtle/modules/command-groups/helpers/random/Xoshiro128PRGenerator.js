import { murmurHash3 } from './murmurHash3.js';
import { PRGenerator } from './PRGenerator.js';

// The following functions were copied from:
// https://www.delftstack.com/howto/javascript/javascript-random-seed-to-generate-random/

function Xoshiro128_twostar(seed_1, seed_2, seed_3, seed_4) {
  return () => {
    let t = seed_2 << 9, y = seed_1 * 5;
    y = (y << 7 | y >>> 25) * 9;
    seed_3 ^= seed_1;
    seed_4 ^= seed_2;
    seed_2 ^= seed_3;
    seed_1 ^= seed_4;
    seed_3 ^= t;
    seed_4 = seed_4 << 11 | seed_4 >>> 21;
    return (y >>> 0) / 4294967296;
  }
}

export class Xoshiro128PRGenerator extends PRGenerator {
	constructor(seed) {
		super();
		const generateSeed = murmurHash3('' + seed);
		this.gen = Xoshiro128_twostar(generateSeed(), generateSeed());
	}

	randomRatio() {
		return this.gen();
	}
};