import { blobToBase64 } from '../../../blobToBase64.js';
import { clamp } from '../../../clamp.js';
import { fetchBlob } from '../../../fetchBlob.js';
import { RateLimiter } from '../../../RateLimiter.js';
import { ShortTermBase64Cache } from './ShortTermBase64Cache.js';

if (typeof window.SuperGif !== 'function')
	console.error(`SuperGif must be a function but is ${window.SuperGif}.  Did you forget to include lib/libgif-js/libgif.js?`);

const cache = new Map();
const maxAge = 30000; // 30 seconds

class CacheItem {
	constructor(gifBase64, numFrames, sup1) {
		this.sup1 = sup1;
		this.gifBase64 = gifBase64;
		this.numFrames = numFrames;
		this.frames64 = [];
		this.refreshLastUsedTime();
	}

	dispose() {
		for (let i = 0; i < this.frames64.length; i++) {
			this.frames64[i] = undefined;
		}
		this.frames64 = undefined;
		this.gifBase64 = undefined;
		this.numFrames = undefined;
		this.sup1 = undefined;
	}

	isTooOld() {
		return (new Date().getTime()) - this.lastTimeUsed > maxAge;
	}

	refreshLastUsedTime() {
		this.lastUsedTime = new Date().getTime();
	}
}

function clearOldCacheItems() {
	const remainingItems = [];
	for (const [key, value] of cache) {
		if (value.isTooOld()) {
			value.dispose();
			continue;
		}
		remainingItems.push(value);
	}
	if (cache.size !== remainingItems.length) {
		cache.clear();
		for (const i of remainingItems)
			cache.set(i.gifBase64, i);
	}
}

function truncatedPrefix(s) {
	const maxLen = 30;
	if (s.length > maxLen)
		s = s.substring(0, maxLen) + '...';
	return s;
}

function processSuperGif(sup1, timeRatio, resolve, item, base64) {
	const len = sup1.get_length();
	const frameIndex = Math.min(len - 1, Math.floor(timeRatio * len));
	sup1.move_to(frameIndex);
	const internalCanvas = sup1.get_canvas();
	const dataUrl = internalCanvas.toDataURL();
	if (item === undefined) {
		item = new CacheItem(base64, len, sup1);
		cache.set(base64, item);
	}
	item.frames64[frameIndex] = dataUrl;
	resolve(dataUrl);
}

/*
SuperGif should be defined in lib/libgif-js/libgif.js.
*/
export async function animatedGifToStaticImageData(gifUrl, timeRatio) {
	if (typeof gifUrl !== 'string')
		throw new Error(`gifUrl must be a string but specified ${gifUrl}`);

	// clean up cache once in a while to prevent the memory for cache taking more RAM than would be helpful.
	RateLimiter.run('animatedGifToStaticImageData', clearOldCacheItems, maxAge);
	timeRatio = clamp(timeRatio, 0, 1);
	return new Promise(function(resolve, reject) {
		ShortTermBase64Cache.getBase64(gifUrl).then(function(base64) {
			let item = cache.get(base64);
			if (item !== undefined) {
				const len = item.numFrames;
				const frameIndex = Math.min(len - 1, Math.floor(timeRatio * len));
				item.refreshLastUsedTime();
				const frame64 = item.frames64[frameIndex];
				if (frame64 !== undefined) {
					resolve(frame64);
				}
				else
					processSuperGif(item.sup1, timeRatio, resolve, item, base64);
				return;
			}
			const img = document.createElement('img');
			img.onload = function() {
				const sup1 = new window.SuperGif({ gif: img } );
				sup1.load(function() {
					processSuperGif(sup1, timeRatio, resolve, item, base64);
				});
			}
			img.src = base64;
		}).catch(function(e) {
			reject(new Error(`Failed to download or decode animated GIF from URL ${truncatedPrefix(gifUrl)}. Additional error details: `+ e));
		});
	});
};