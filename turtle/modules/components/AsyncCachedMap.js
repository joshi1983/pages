export class AsyncCachedMap {
	/*
	asyncGetter is a function that always returns a Promise(an async function).
	asyncGetter should take the key as parameter.

	maxSize is the maximum number of pairs to maintain in this map.
	A limit is set to prevent an AsyncCachedMap from using too much memory.
	*/
	constructor(asyncGetter, maxSize) {
		if (typeof asyncGetter !== 'function')
			throw new Error(`asyncGetter must be a function but got ${asyncGetter}`);
		if (!Number.isInteger(maxSize))
			throw new Error(`maxSize must be an integer but got ${maxSize}`);
		if (maxSize < 1)
			throw new Error(`maxSize must be at least 1 but got ${maxSize}`);
		this.asyncGetter = asyncGetter;
		this.maxSize = maxSize;
		this.map = new Map();
		this.readAgeMap = new Map();
	}

	/*
	Call dispose() when you're done with a AsyncCachedMap and want 
	to help the JavaScript engine free the associated memory.
	*/
	dispose() {
		this.map.clear();
		this.readAgeMap.clear();
		this.map = undefined;
		this.readAgeMap = undefined;
		this.maxSize = undefined;
		this.asyncGetter = undefined;
	}

	async get(key) {
		if (!this.map.has(key)) {
			if (this.readAgeMap.size >= this.maxSize) {
				// get oldest key.
				let oldestKey;
				let oldest;
				for (const key of this.readAgeMap.keys()) {
					const age = this.readAgeMap.get(key);
					if (oldestKey === undefined || oldest > age) {
						oldestKey = key;
						oldest = age;
					}
				}
				this.readAgeMap.delete(oldestKey);
				this.map.delete(oldestKey);
			}
			this.map.set(key, await this.asyncGetter(key));
		}
		this.readAgeMap.set(key, new Date().getTime());
		return this.map.get(key);
	}
};