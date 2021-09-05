import { arc } from './arc.js';
import { clear } from './clear.js';
import { endFill } from './endFill.js';
import { setColor } from './setColor.js';
import { startFill } from './startFill.js';

const processors = new Map();
[
arc,
clear,
endFill,
setColor,
startFill
].forEach(function(func) {
	processors.set(func.name, func);
});

export function isSpecialFunction(callToken) {
	if (callToken.children.length === 0)
		return false;
	return processors.has(callToken.children[0].val);
};

export function processSpecialFunction(callToken, result) {
	const processor = processors.get(callToken.children[0].val);
	processor(callToken, result);
};