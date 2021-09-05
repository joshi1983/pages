import { mixItems } from './mixItems.js';

export function mixItems2(items, ratio) {
	return mixItems(items, ratio * (items.length - 1) / items.length);
};