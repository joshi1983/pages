import { Command } from
'../../../Command.js';
import { getArgCount } from
'../../../generic-parsing-utilities/getArgCount.js';
import { moveArgsForParameterizedGroup } from
'../../../../components/code-editor/code-fixer/fixers/helpers/moveArgsForParameterizedGroup.js';
import { ParseTreeToken } from
'../../../ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { trigFunctions } from
'./replaceTrigFunctionNames.js';

const prefixedToWebLogoNames = new Map([
	['degreeacs', 'arcCos'],
	['degreeasn', 'arcSin'],
	['degreeatn', 'arcTan'],
	['degreerotate', 'setHeading'],
]);
for (const s of trigFunctions) {
	const key = 'degree' + s;
	if (!prefixedToWebLogoNames.has(key))
		prefixedToWebLogoNames.set(key, s);
}

function handleSetHeading(token, cachedParseTree) {
	// we need to add a unary - operator before the parameter.
	const param = token.children[0];
	let negative;
	if (param === undefined) {
		negative = new ParseTreeToken('-', null, token.lineIndex, token.colIndex + 1,
			ParseTreeTokenType.UNARY_OPERATOR);
	}
	else {
		negative = new ParseTreeToken('-', null, param.lineIndex, param.colIndex - 1,
			ParseTreeTokenType.UNARY_OPERATOR);
		param.remove();
		negative.appendChild(param);
	}
	token.appendChild(negative);
	cachedParseTree.tokenAdded(negative);
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
		const commandInfo = Command.getCommandInfo(token.val);
		const numExpectedParameters = getArgCount(commandInfo, token);
		moveArgsForParameterizedGroup(token, numExpectedParameters);
		if (token.val === 'setHeading')
			handleSetHeading(token, cachedParseTree);
		fixLogger.log(`Replaced trig function from ${oldVal} to ${token.val}`, token);
	});
};