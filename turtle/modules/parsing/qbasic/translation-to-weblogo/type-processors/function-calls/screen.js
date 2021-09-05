import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { processToken } from '../processToken.js';

export function screen(token, result, options) {
	if (options.ignoreScreenCalls !== true) {
		const argList = token.children[1];
		if (argList !== undefined) {
			const argValueToken = argList.children.filter(mightBeDataValue)[0];
			if (argValueToken !== undefined) {
				result.append(`\nmake "screen `);
				processToken(argValueToken, result, options);
				result.append('\n');
			}
		}
	}
};