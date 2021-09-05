import { AssetRepository } from '../../../assets/AssetRepository.js';
import { blobToBase64 } from '../../../blobToBase64.js';
import { fetchBlob } from '../../../fetchBlob.js';
import { RateLimiter } from '../../../RateLimiter.js';

const cache = new Map();
const maxAge = 30000; // 30 seconds
const maxItems = 10; 
// we don't want this cache to use most of the available RAM.
class CacheItem {
	constructor(base64) {
		if (typeof base64 !== 'string')
			throw new Error(`base64 must be a string but base64=${base64}`);
		this.lastUseTime = new Date();
		this.base64 = base64;
	}
}

function isTooOld(date) {
	const now = new Date();
	return (now.getTime() - date.getTime()) > maxAge;
}

function compareByAge(item1, item2) {
	return item2[1].lastUseTime.getTime() - item1[1].lastUseTime.getTime();
}

function removeOldItems() {
	const itemsToKeep = [];
	for (const [url, item] of cache) {
		if (isTooOld(item.lastUseTime))
			continue;
		itemsToKeep.push([url, item]);
	}
	if (itemsToKeep.length > maxItems) {
		// remove some of the oldest items.
		itemsToKeep.sort(compareByAge);
		itemsToKeep.splice(maxItems);
	}
	if (itemsToKeep.length !== cache.size) {
		cache.clear();
		for (const pair of itemsToKeep) {
			cache.set(pair[0], pair[1]);
		}
	}
}

export class ShortTermBase64Cache {
	static async getBase64(url) {
		// if already base-64, return immediately.
		if (url.startsWith('data:'))
			return url;
		if (url.startsWith('local:')) {
			let filename = url.substring('local:'.length);
			while (filename.startsWith('/'))
				filename = filename.substring(1);
			const asset = AssetRepository.getAssetByFilename(filename);
			if (asset !== undefined)
				return asset.getBase64URI();
		}
		let item = cache.get(url);
		if (item === undefined) {
			const blob = await fetchBlob(url);
			item = new CacheItem(await blobToBase64(blob));
			cache.set(url, item);
			removeOldItems();
		}
		else {
			item = cache.get(url);
			item.lastUseTime = new Date();
			// indicate this item was used just now.
			// Help it stay in cache longer.
		}
		RateLimiter.run('ShortTermBase64Cache', removeOldItems, maxAge);
		// clean the cache once in a while.
		return item.base64;
	}
};