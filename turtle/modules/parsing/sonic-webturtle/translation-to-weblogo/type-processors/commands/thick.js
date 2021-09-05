import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

export function thick(token, result, settings) {
	if (token.children.length === 1) {
		const child = token.children[0];
		result.append(`setPenSize `);
		if (child.type === ParseTreeTokenType.NUMBER_LITERAL) {
			if (child.val.startsWith('-'))
				result.append(`max 0 penSize - ${Math.abs(parseFloat(child.val))}`);
			else if (child.val.startsWith('+'))
				result.append(`penSize + ${parseFloat(child.val)}`);
			else
				result.append(child.val);
		}
		else
			processToken(child, result, settings);
	}
	else {
		result.append(`; Unable to translate call to thick because\n`);
		result.append(`; 1 parameter was expected but ${token.children.length} was found\n`);
	}
};