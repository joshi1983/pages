import { evaluateLiteralToken } from
'../../evaluators/evaluateLiteralToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export function processDo(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result) {
		result.processCommentsUpToToken(token);
		if (token.children.length === 0)
			return;
		if (token.children.length === 1)
			processToken(token.children[0]);
		else if (token.children.length === 2) {
			const conditionToken = token.children[1].children[0];
			let maxIndex = 1;
			if (conditionToken !== undefined) {
				const val = evaluateLiteralToken(conditionToken);
				if (val !== undefined && !!val) {
					result.append('forever ');
					maxIndex = 0;
				}
				else {
					result.append('do.while ');
				}
			}
			const children = token.children;
			for (let i = 0; i <= maxIndex; i++) {
				const child = children[i];
				if (child.type === ParseTreeTokenType.WHILE) {
					let conditionToken = child.children[0];
					if (conditionToken !== undefined) {
						if (conditionToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
						conditionToken.children.length === 3)
							conditionToken = conditionToken.children[1];
						result.append(' ');
						processToken(conditionToken, result);
					}
				}
				else
					processToken(child, result);
			}
		}
	};
};