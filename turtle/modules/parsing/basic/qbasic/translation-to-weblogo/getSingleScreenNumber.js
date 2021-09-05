import { evaluateToken } from
'../evaluation/evaluateToken.js';
import { functionCallToFunctionName } from
'../parsing/functionCallToFunctionName.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { mightBeDataValue } from
'../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function isScreenCall(callToken) {
	const name = functionCallToFunctionName(callToken);
	return name !== undefined && name.toLowerCase() === 'screen';
}

/*
Returns a single screen number if there is only 1.
Otherwise, returns undefined.
*/
export function getSingleScreenNumber(root) {
	const screenCalls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isScreenCall);
	let number = 0;
	for (const call of screenCalls) {
		const argTokens = call.children[1].children.filter(mightBeDataValue);
		if (argTokens.length !== 1)
			return;
		const val = evaluateToken(argTokens[0]);
		if (Number.isInteger(val) && val >= 0 && val <= 12) {
			if (number !== 0 && number !== val)
				return;
			number = val;
		}
		else if (val === undefined)
			return undefined;
	}
	return number;
};