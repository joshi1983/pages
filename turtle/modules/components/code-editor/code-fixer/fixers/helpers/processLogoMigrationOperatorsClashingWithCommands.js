import { Command } from '../../../../../parsing/Command.js';
import { isLikelyInstructionList } from './isLikelyInstructionList.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
import { processOperatorChildrenIfPossible } from './processOperatorChildrenIfPossible.js';

function isOperatorOfInterest(operatorInfo) {
	if (operatorInfo.to === undefined)
		return false;
	const commandInfo = Command.getCommandInfo(operatorInfo.symbol);
	return commandInfo !== undefined && commandInfo.returnTypes === null;
}

function isTokenOfInterest(operators) {
	const symbolsLowerCase = new Set(operators.map(o => o.symbol.toLowerCase()));
	return function(token) {
		if (!symbolsLowerCase.has(token.val.toLowerCase()))
			return false;
		const parent = token.parentNode;
		return !isLikelyInstructionList(parent);
	};
}

export function processLogoMigrationOperatorsClashingWithCommands(cachedParseTree, fixLogger, info) {
	if (!(info.operators instanceof Array))
		return;
	const operatorsOfInterest = info.operators.filter(isOperatorOfInterest);
	if (operatorsOfInterest.length === 0)
		return;
	const tokensOfInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isTokenOfInterest(operatorsOfInterest));
	if (tokensOfInterest.length === 0)
		return;
	const operatorsMap = new Map();
	operatorsOfInterest.forEach(function(operatorInfo) {
		operatorsMap.set(operatorInfo.symbol.toLowerCase(), operatorInfo);
	});
	tokensOfInterest.forEach(function(token) {
		const oldVal = token.val;
		token.type = ParseTreeTokenType.BINARY_OPERATOR;
		token.val = operatorsMap.get(token.val).to;
		// move all children to become siblings to be more like what processOperatorChildrenIfPossible expects.
		for (let i = token.children.length - 1; i >= 0; i--) {
			const toMove = token.children[i];
			toMove.remove();
			token.appendSibling(toMove);
		}
		processOperatorChildrenIfPossible(token);
		cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
		cachedParseTree.tokenValueChanged(token, oldVal);
		fixLogger.log(`Replaced ${oldVal} with ${token.val} because that is how the operator is expressed in WebLogo.`, token);
	});
};