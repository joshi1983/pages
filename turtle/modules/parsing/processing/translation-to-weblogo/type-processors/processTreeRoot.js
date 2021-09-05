import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';

function tokenToMethodName(token) {
	const children = token.children;
	if (children.length < 2)
		return;
	return children[1].val;
}

export function processTreeRoot(token, result, settings) {
	if (typeof settings !== 'object')
		throw new Error(`settings must be an object but got ${settings}`);
	for (const child of token.children) {
		processToken(child, result, settings);
	}
	const methodsToCall = ['setup', 'draw'];
	const methodsToCallSet = new Set(methodsToCall);
	const methodTokensOfInterest = getDescendentsOfType(token, ParseTreeTokenType.METHOD).
		filter(t => methodsToCallSet.has(tokenToMethodName(t)));
	const methodNamesToCallSet = new Set(methodTokensOfInterest.map(tokenToMethodName));
	for (const methodName of methodsToCall) {
		if (methodNamesToCallSet.has(methodName))
			result.append(`\n${methodName}\n`);
	}
};