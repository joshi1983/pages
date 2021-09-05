import { evaluateLiteralToken } from
'../../evaluators/evaluateLiteralToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isAlwaysTrue(token) {
	const val = evaluateLiteralToken(token);
	if (val === undefined)
		return false;
	return !!val;
}

export function processWhile(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken expected to be a function but got ${processToken}`);
	return function(token, result, settings) {
		result.processCommentsUpToToken(token);
		let startIndex = 0;
		if (token.children.length === 0 || isAlwaysTrue(token.children[0])) {
			result.append('forever ');
			if (token.children.length === 0) {
				result.append('[\n]\n');
				return;
			}
			startIndex = 1;
		}
		else {
			result.append('while ');
		}
		const children = token.children;
		for (let i = startIndex; i < children.length; i++) {
			let child = children[i];
			if (i === 0 && child.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
			child.children.length === 3)
				child = child.children[1];
			if (i !== startIndex)
				result.append(' ');
			processToken(child, result, settings);
		}
		if (children.length === 1) {
			result.append('[\n]\n');
		}
	};
};