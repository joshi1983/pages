import { evaluateToken } from '../../evaluation/evaluateToken.js';
import { processToken } from './processToken.js';

export function processWhile(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length >= 2) {
		const condition = children[0];
		const codeBlock = children[1];
		const conditionVal = evaluateToken(condition);
		if (conditionVal !== undefined && !!conditionVal)
			result.append(' forever ');
		else {
			result.append(' while ');
			processToken(condition, result, options);
		}
		processToken(codeBlock, result, options);
	}
};