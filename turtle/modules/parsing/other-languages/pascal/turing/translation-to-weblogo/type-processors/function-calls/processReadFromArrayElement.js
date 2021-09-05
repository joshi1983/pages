import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { isLikelyArrayVariableReference } from
'../../../parsing/parse-tree-analysis/variable-data-types/isLikelyArrayVariableReference.js';
import { processToken } from
'../processToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function processReadFromArrayElement(token, result) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.children.length === 2 &&
	parent.children[0] === token) {
		return false;
			// For example a(1) = 3;
	}

	const nameToken = token.children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.children.length !== 0)
		return false;

	const children = token.children;
	const argList = children[1];
	if (argList === undefined)
		return false;

	const indexToken = filterBracketsAndCommas(argList.children)[0];
	if (indexToken === undefined)
		return false;

	const variableName = nameToken.val.toLowerCase();
	// is variableName likely the name of an array?
	if (isLikelyArrayVariableReference(token, variableName)) {
		// for example, put a(1)
		result.append(`(item `);
		processToken(indexToken, result);
		result.append(` :${variableName} `);
		result.append(` )`);
		return true;
	}
	return false;
};