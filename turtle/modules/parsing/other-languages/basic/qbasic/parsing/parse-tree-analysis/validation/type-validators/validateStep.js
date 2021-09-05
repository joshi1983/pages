import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { badChildTypes } from './validateUnaryOperator.js';

export function validateStep(token, parseLogger) {
	const parent = token.parentNode;
	if (parent !== null && parent.type !== ParseTreeTokenType.FOR)
		parseLogger.error(`Expected parent of a STEP to be a FOR but found parent to be a ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (children.length !== 1) {
		parseLogger.error(`Expected a STEP to have 1 child but found ${children.length}`, token);
	}
	else if (children.length === 1) {
		const child = children[0];
		if (badChildTypes.has(child.type))
			parseLogger.error(`Expected a STEP to not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, child);
	}
};