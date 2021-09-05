import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';
import { typesToInitialValue } from
'../helpers/typesToInitialValue.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

function getArgListValues(token) {
	const argList = token.children[1];
	const argValues = filterBracketsAndCommas(argList.children);
	return argValues;
}

export function canMakeBeProcessed(token) {
	const argValues = getArgListValues(token);
	if (argValues.length < 2 || argValues.length > 3)
		return false;
	return true;
};

export function make(token, result, settings) {
	const argValues = getArgListValues(token);
	let types = argValues[0];
	if (types.type === ParseTreeTokenType.ARRAY_LITERAL && types.children.length >= 2)
		types = types.children[1];
	const lengthToken = argValues[1];
	// We ignore argValues[2] because the capacity won't translate to a useful value in WebLogo.
	// Arrays in Go have a static capacity but lists in WebLogo have a dynamically length.
	const length = evaluateToken(lengthToken);
	const initValue = typesToInitialValue(types);
	if (length === 0 || initValue === undefined)
		result.append(' [] ');
	else {
		result.append(` (duplicate ${valueToLiteralCode(initValue)} `);
		processToken(lengthToken, result, settings);
		result.append(' ) ');
	}
};