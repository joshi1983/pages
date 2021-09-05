import { arc } from './arc.js';
import { fillRect } from './fillRect.js';
import { fillText } from './fillText.js';
import { getDeepestName } from
'../../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processFunctionCall.js';
import { lineTo } from './lineTo.js';
import { strokeText } from './strokeText.js';
const processors = new Map();
[arc,
fillRect,
fillText,
lineTo,
strokeText
].forEach(function(func) {
	processors.set(func.name, func);
});
export function isSpecialFunction(callToken) {
	if (callToken.children.length === 0)
		return false;
	const name = getDeepestName(callToken);
	return processors.has(name);
};

export function processSpecialFunction(callToken, result, settings) {
	const name = getDeepestName(callToken);
	const processor = processors.get(name);
	processor(callToken, result, settings);
};