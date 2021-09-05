import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { processToken } from '../processToken.js';

export function left$(token, result, options) {
	const argList = token.children[1];
	const children = argList.children.filter(mightBeDataValue);
	if (children.length === 2) {
		result.append(` substring `);
		processToken(children[0], result, options);
		result.append(' 1 ');
		processToken(children[1], result, options);
		result.append(' ');
	}
};