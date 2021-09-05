import { mightBeDataValue } from
'../../../parsing/mightBeDataValue.js';
import { processToken } from
'../processToken.js';

export function type(token, result) {
	if (token.children.length !== 2)
		return false;

	const valueTokens = token.children[1].children.filter(mightBeDataValue);
	if (valueTokens.length !== 0) {
		if (valueTokens.length === 1) {
			result.append('\nprint ');
			processToken(valueTokens[0], result);
		}
		else {
			for (let i = 0; i < valueTokens.length - 1; i++) {
				const valueToken = valueTokens[i];
				result.append('\ntype ');
				processToken(valueToken, result);
				result.append('\ntype \', \'');
			}
			result.append('\nprint ');
			processToken(valueTokens[valueTokens.length - 1], result);
		}
		result.append('\n');
	}
	
	return true;
};