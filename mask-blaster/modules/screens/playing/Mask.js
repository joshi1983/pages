import { fetchJson } from '../../fetchJson.js';
import { readPixel } from './readPixel.js';

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
				info.aspectRatio = info.img.width / info.img.height;
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

export const MaskZVelocity = 0.003;
const maxZ = 10;
const maxRedDelta = Math.hypot(255, 255, 255);

export class Mask {
	constructor() {
		this.x = -0.5 + Math.random();
		this.y = -0.5 + Math.random();
		this.z = maxZ;
		this.health = 1;
		this.staticInfo = staticInfo[Math.floor(Math.random() * staticInfo.length)];
	}

	damage() {
		this.health -= 0.2;
	}

	getInfoAtPoint(x, y) {
		const dx = x - this.x;
		const dy = y - this.y;
		if (dx < -0.5 || dx > 0.5)
			return;

		const c = readPixel(this.staticInfo.img, x, y);
		if (c[3] < 10) // anywhere from transparent to very transparent
			return;

		const redDelta = Math.hypot(c[0] - 255, c[1], c[2]);
		return {
			'redDelta': redDelta / maxRedDelta
		};
	}

	remove(mask) {
		const index = masks.indexOf(mask);
		if (index === -1)
			throw new Error(`Unable to remove mask because it was not found.`);
		else
			masks.splice(index, 1);
	}

	render(context2D, width, height, viewpoint) {
		const dx = viewpoint.x - this.x;
		const dy = viewpoint.y - this.y;
		const w = width / this.z;
		const img = this.staticInfo.img;
		const h = w * img.height / img.width;
		const cx = width / 2 + w * dx;
		const cy = height / 2 + w * dy;
		context2D.drawImage(img, cx - w / 2, cy - h / 2, w, h);
	}

	simulateTime(delta) {
		this.z -= delta * MaskZVelocity;
	}
};