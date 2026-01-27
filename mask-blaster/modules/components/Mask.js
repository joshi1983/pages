import { fetchJson } from '../fetchJson.js';

const staticInfo = [];

let cachedPromise;

async function _asyncInit() {
	const prefix = 'assets/masks/';
	const data = await fetchJson(prefix + 'masks.json');
	for (const maskInfo of data) {
		const info = {};
		info.img = document.createElement('img');
		const promise = new Promise(function(resolve, reject) {
			info.img.addEventListener('load', function() {
				resolve();
			});
		});
		info.img.src = prefix + maskInfo.filename;
		await promise;
		staticInfo.push(info);
	}
}

// a cache is used for performance reasons.
// It is so callers don't trigger any needless HTTP requests 
// or processing of images after it is already loaded.
export async function asyncInit() {
	if (cachedPromise === undefined)
		cachedPromise = _asyncInit();

	return cachedPromise;
};

const maxZ = 10;

export class Mask {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.z = maxZ;
		this.health = 1;
		this.staticInfo = staticInfo[Math.floor(Math.random() * staticInfo.length)];
	}

	remove(mask) {
		const index = masks.indexOf(mask);
		if (index === -1)
			throw new Error(`Unable to remove mask because it was not found.`);
		else
			masks.splice(index, 1);
	}

	render(context2D, width, height, viewpoint) {
		const w = width / this.z;
		const img = this.staticInfo.img;
		const h = w * img.height / img.width;
		const cx = width / 2 + w * viewpoint.x / this.z;
		const cy = height / 2 + w * viewpoint.y / this.z;
		context2D.drawImage(img, cx - w / 2, cy - h / 2, w, h);
	}

	simulateTime(delta) {
		this.z -= delta * 0.003;
	}
};