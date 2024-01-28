import { clamp } from '../../clamp.js';
import { mix } from './mix.js';

export function mixItems(items, ratio) {
	const len = items.length;
	if (len === 0)
		throw new Error(`The number of items must be at least 1 to calculate anything but items is empty.`);
	else if (len === 1)
		return items[0];
	const index1 = Math.floor(len * ratio) % items.length;
	const index2 = (index1 + 1) % items.length;
	ratio = 1 - (ratio * len - Math.floor(ratio * len));
	return mix(items[index1], items[index2], ratio);
};