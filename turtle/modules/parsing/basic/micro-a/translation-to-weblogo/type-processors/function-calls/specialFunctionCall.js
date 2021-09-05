import { circle } from './circle.js';
import { line } from './line.js';
import { ParseTreeTokenType } from
'../../../../qbasic/ParseTreeTokenType.js';
import { pset } from './pset.js';
import { rect } from './rect.js';

const processors = new Map();
for (const processor of [circle, line, pset, rect]) {
	processors.set(processor.name, processor);
}

export function isSpecialFunctionApplicableTo(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;
	const nameToken = children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.children.length !== 0)
		return false;

	const processor = processors.get(nameToken.val.toLowerCase());
	if (processor === undefined ||
	(typeof processor.isApplicableTo === 'function' &&
	!processor.isApplicableTo(token)))
		return false;
	return true;
};

export function specialFunctionCall(token, result, options) {
	const processor = processors.get(token.children[0].val.toLowerCase());
	processor(token, result, options);
};