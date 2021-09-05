import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { trigFunctions } from
'./replaceTrigFunctionNames.js';

const prefixedToWebLogoNames = new Map([
	['degreeacs', 'arcCos'],
	['degreeasn', 'arcSin'],
	['degreeatn', 'arcTan'],
]);
for (const s of trigFunctions) {
	const key = 'degree' + s;
	if (!prefixedToWebLogoNames.has(key))
		prefixedToWebLogoNames.set(key, s);
}


function isOfInterest(token) {
	return prefixedToWebLogoNames.has(token.val.toLowerCase());
}

export function replaceDegreeTrigFunctions(cachedParseTree, fixLogger) {
	const degreeTrigCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	degreeTrigCalls.forEach(function(token) {
		const oldVal = token.val;
		const oldType = token.type;
		token.val = prefixedToWebLogoNames.get(token.val.toLowerCase());
		token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		cachedParseTree.tokenTypeChanged(token, oldType);
		fixLogger.log(`Replaced trig function from ${oldVal} to ${token.val}`, token);
	});
};