import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { processToken } from '../processToken.js';

export function color(token, result, options) {
	result.processCommentsUpToToken(token);
	const argList = token.children[1];
	if (argList === undefined)
		return;
	const args = argList.children.filter(mightBeDataValue);
	if (args.length !== 0) {
		result.append('\nsetPenColor ');
		processToken(args[0], result, options);
		if (args.length > 1) {
			result.append('\nsetFillColor ');
			processToken(args[1], result, options);
		}
		result.append('\n');
	}
};