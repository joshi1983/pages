import { Command } from '../../../../../parsing/Command.js';
import { getSortedFirstDescendentTokenOf } from
'../../../../../parsing/generic-parsing-utilities/getSortedFirstDescendentTokenOf.js';
import { insertColIndexSpanAt } from
'../../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
import { oneChildNeeded, twoChildrenNeeded } from './processOperatorChildrenIfPossible.js';
await Command.asyncInit();

function isOperatorOfInterest(op) {
	return op.convertToCommand !== undefined;
}

function isTokenOfInterest(operators) {
	return function(token) {
		if (!operators.has(token.val))
			return false;
		return true;
	};
}

/*
Similar to a function by the same name in renameParameterizedGroupToken.js but
with some important differences for this use.  The only difference is when the 
associated command's argument count isFlexible.
*/
function getExpectedArgCountForToken(token) {
	const commandInfo = Command.getCommandInfo(token.val);
	const argCount = Command.getArgCount(commandInfo);
	if (argCount.isFlexible) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
			return parent.children.filter(c => !c.isBracket()).length - 1;
		}
	}
	return argCount.defaultCount;
}

export function processOperatorToCommand(cachedParseTree, fixLogger, info) {
	const operatorsOfInterest = info.operators.filter(isOperatorOfInterest);
	if (operatorsOfInterest.length === 0)
		return; // save some execution time by skipping the following work when 
	// it won't do anything useful.
	const operatorsInfoMap = new Map();
	operatorsOfInterest.forEach(function(op) {
		operatorsInfoMap.set(op.symbol, op);
	});
	const tokensOfInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isTokenOfInterest(operatorsInfoMap));
	tokensOfInterest.forEach(function(token) {
		const oldVal = token.val;
		const oldType = token.type;
		const op = operatorsInfoMap.get(token.val);
		token.val = op.convertToCommand;
		token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		cachedParseTree.tokenTypeChanged(token, oldType);
		// FIXME: adjust children of token.
		const argCount = getExpectedArgCountForToken(token);
		if (argCount === 2) {
			twoChildrenNeeded(token);
			const firstDescendentToken = getSortedFirstDescendentTokenOf(token);
			token.lineIndex = firstDescendentToken.lineIndex;
			token.colIndex = firstDescendentToken.colIndex - 1;
			insertColIndexSpanAt(token, token.val.length + 1);
			token.colIndex += token.val.length;
		}
		else if (argCount === 1) {
			oneChildNeeded(token);
		}
		fixLogger.log(`Replaced ${oldVal} with ${token.val} because that is how WebLogo does what was done in ${info.name}`, token);
	});
};