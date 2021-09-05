import { evaluateStringLiteral } from
'../../parsing/parse-tree-analysis/variable-data-types/evaluation/evaluateStringLiteral.js';
import { stringValueToWebLogoStringLiteral } from
'../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processStringLiteral(token, result) {
	const val = evaluateStringLiteral(token);
	result.append(stringValueToWebLogoStringLiteral(val));
};