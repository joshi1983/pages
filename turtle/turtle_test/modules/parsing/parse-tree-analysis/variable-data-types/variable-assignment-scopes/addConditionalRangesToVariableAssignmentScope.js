import { Command } from '../../../Command.js';
import { ConditionalRange } from './ConditionalRange.js';
import { getDescendentsOfType } from '../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getSatisfyingDataTypes } from './getSatisfyingDataTypes.js';
import { getSortedTokenIndex } from '../../cached-parse-tree/getSortedTokenIndex.js';
import { getSortedTokens } from '../../cached-parse-tree/getSortedTokens.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';
import { typePredicateMap } from './typePredicateMap.js';
await Command.asyncInit();
const lowerCaseSet = new Set();
const conditionalNames = ['if', 'while', 'until'];
conditionalNames.forEach(function(name) {
	const info = Command.getCommandInfo(name);
	SetUtils.addAll(lowerCaseSet, Command.getLowerCaseCommandNameSet(info));
});

function getConditionToken(token) {
	const info = Command.getCommandInfo(token.val);
	for (let i = 0; i < info.args.length; i++) {
		const argInfo = info.args[i];
		if (argInfo.types === 'bool')
			return token.children[i];
	}
}

function getInstructionToken(token) {
	const info = Command.getCommandInfo(token.val);
	for (let i = 0; i < info.args.length; i++) {
		const argInfo = info.args[i];
		if (argInfo.types === 'instructionlist')
			return token.children[i];
	}
}

function isConditionDescendentTokenOfInterest(token, variableName) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
	token.children.length !== 1 ||
	token.children[0].type !== ParseTreeTokenType.VARIABLE_READ ||
	token.children[0].val.toLowerCase() !== variableName)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	return typePredicateMap.has(info.primaryName);
}

function isOfInterestToVariable(variableName) {
	function isConditionDescendentOfInterest(token) {
		return isConditionDescendentTokenOfInterest(token, variableName);
	}
	return function(token) {
		if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
		token.children.length < 2)
			return false;
		if (!lowerCaseSet.has(token.val.toLowerCase()))
			return false;
		const conditionToken = getConditionToken(token);
		if (conditionToken === undefined)
			return false;

		return getDescendentsOfType(conditionToken, ParseTreeTokenType.PARAMETERIZED_GROUP).
			some(isConditionDescendentOfInterest);
	};
}

function getTokensOfInterest(scope, cachedParseTree) {
	const sortedTokens = getSortedTokens(cachedParseTree);
	const fromIndex = getSortedTokenIndex(cachedParseTree, scope.fromToken);
	const toIndex = getSortedTokenIndex(cachedParseTree, scope.toToken);
	if (fromIndex === -1 || toIndex === -1)
		return [];
	const tokensOfInterest = [];
	const variableName = scope.variable.name.toLowerCase();
	const isOfInterest = isOfInterestToVariable(variableName);
	for (let i = fromIndex; i <= toIndex; i++) {
		const token = sortedTokens[i];
		if (isOfInterest(token))
			tokensOfInterest.push(token);
	}
	return tokensOfInterest;
}

export function addConditionalRangesToVariableAssignmentScope(scope, cachedParseTree) {
	const tokensOfInterest = getTokensOfInterest(scope, cachedParseTree);
	const variableName = scope.variable.name;
	tokensOfInterest.forEach(function(token) {
		const conditionToken = getConditionToken(token);
		const instructionToken = getInstructionToken(token);
		if (instructionToken === undefined)
			return;
		const fromToken = instructionToken.children[0];
		const toToken = instructionToken.children[instructionToken.children.length - 1];
		const satisfyingDataTypes = getSatisfyingDataTypes(conditionToken, variableName);
		if (satisfyingDataTypes === undefined)
			return;
		scope.conditionalRanges.push(new ConditionalRange(conditionToken, fromToken, toToken, satisfyingDataTypes));
	});
};