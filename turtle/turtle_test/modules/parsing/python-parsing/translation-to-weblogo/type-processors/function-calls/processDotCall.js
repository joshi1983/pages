import { DataTypes } from '../../../data-types/DataTypes.js';
import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { getArgumentValueToken } from './getArgumentValueToken.js';
import { processToken } from '../../processToken.js';

const exclusiveColorTypes = new Set([
'list', 'list|string', 'list|tuple', 'string', 'tuple'
]);

function processSingleArgument(argToken, result, cachedParseTree) {
	const types = cachedParseTree.getTokensToDataTypes().get(argToken);
	if (types !== undefined) {
		const sTypes = DataTypes.stringify(types);
		if (exclusiveColorTypes.has(sTypes)) {
			// treat argument as color.
			result.append('\npyDot -1 ');
			processToken(argToken, result, cachedParseTree);
			result.append('\n');
			return;
		}
	}
	// treat argument as size.
	result.append('\npyDot ');
	processToken(argToken, result, cachedParseTree);
	result.append(' penColor\n');
}

export function processDotCall(token, result, cachedParseTree) {
	const parameterTokens = filterBracketsAndCommas(token.children);
	if (parameterTokens.length === 0) {
		result.append('\npyDot -1 penColor\n');
	}
	else if (parameterTokens.length === 1) {
		processSingleArgument(parameterTokens[0], result, cachedParseTree);
	}
	else if (parameterTokens.length === 2) {
		result.append('\npyDot ');
		processToken(parameterTokens[0], result, cachedParseTree);
		result.append(' ');
		processToken(getArgumentValueToken(parameterTokens[1]), result, cachedParseTree);
		result.append('\n');
	}
	else
		return false;
};