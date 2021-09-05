import { fillStyle } from './fillStyle.js';
import { font } from './font.js';
import { strokeStyle } from './strokeStyle.js';

const processorsMap = new Map();
[fillStyle, font, strokeStyle].forEach(function(processor) {
	const name = processor.name;
	processorsMap.set(name, processor);
});

export function isSpecialProperty(info) {
	return processorsMap.has(info.name);
};

export function processSpecialProperty(info, token, result, settings) {
	const processor = processorsMap.get(info.name);
	processor(token, result, settings);
};