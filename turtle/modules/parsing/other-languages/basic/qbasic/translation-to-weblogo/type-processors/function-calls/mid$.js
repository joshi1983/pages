import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processTokens } from
'../helpers/processTokens.js';

export function getToName(token) {
	const parent = token.parentNode;
	const parentChildIndex = parent.children.indexOf(token);
	if (parentChildIndex === 0 &&
	token.children.length === 2 &&
	parent.type === ParseTreeTokenType.ASSIGNMENT) {
		const argList = token.children[1];
		const argValues = argList.children.filter(mightBeDataValue);
		if (argValues.length === 3)
			return 'qbMidStringReplace4';
		else
			return 'midString';
	}
	else
		return 'midString';
};

export function mid$(token, result, options) {
	const name = getToName(token);
	result.append(` ${name} `);
	processTokens(token.children[1].children.filter(mightBeDataValue), result, options);
};