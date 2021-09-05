import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';
import { ReservedWord } from
'../../../ReservedWord.js';

function isPushApplicableTo(token) {
	const firstChild = token.children[0];
	if (firstChild.children.length !== 1 ||
	firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
		
	if (ReservedWord.isReservedWord(firstChild.val))
		return false;

	const dotChild = firstChild.children[0];
	if (dotChild.type !== ParseTreeTokenType.DOT ||
	dotChild.children.length !== 1)
		return false;

	const methodNameToken = dotChild.children[0];
	if (methodNameToken.children.length !== 0 ||
	methodNameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	methodNameToken.val !== 'push')
		return false;

	const argList = token.children[1];
	if (argList.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	
	// FIXME: Ideally, we'd also check that firstChild corresponds with a
	// value that might be an Array too.
	// We're not there yet.

	return true;
};

export function push(token, result, options) {
	if (!isPushApplicableTo(token))
		return false;

	const variableNameToken = token.children[0];
	const variableName = variableNameToken.val;
	const argumentTokens = filterBracketsAndCommas(token.children[1].children);
	for (const argToken of argumentTokens) {
		result.append(`\nqueue2 "${variableName} `);
		processToken(argToken, result, options);
		result.append('\n');
	}
	return true;
};