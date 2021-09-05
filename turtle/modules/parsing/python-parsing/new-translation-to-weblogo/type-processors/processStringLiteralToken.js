import { getStringLiteralValue } from '../../parse-tree-analysis/variable-data-types/evaluators/getStringLiteralValue.js';
import { stringValueToWebLogoStringLiteral } from '../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processStringLiteralToken(token, result, cachedParseTree) {
	result.append(stringValueToWebLogoStringLiteral(getStringLiteralValue(token)));
};