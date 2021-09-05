import { filterBrackets } from
'../helpers/filterBrackets.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

export function hypot(token, result) {
	const children = token.children;
	if (children.length !== 0) {
		result.append('Math.hypot(');
		const child = children[0];
		if (child.type === ParseTreeTokenType.LIST) {
			const valTokens = filterBrackets(child.children);
			let isFirst = true;
			for (const valToken of valTokens) {
				if (!isFirst)
					result.append(', ');
				else
					isFirst = false;
				processToken(valToken, result);
			}
		}
		else {
			result.append('...');
			processToken(child, result);
		}
		result.append(')');
	}
};