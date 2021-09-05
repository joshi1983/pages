import { Command } from '../../../Command.js';
import { CommandCalls } from '../../CommandCalls.js';
import { DataTypes } from '../../../data-types/DataTypes.js';
import { getProcedureFromAnyTokenInProcedure } from '../getProcedureFromAnyTokenInProcedure.js';
import { getSortedTokenIndex } from '../../cached-parse-tree/getSortedTokenIndex.js';
import { getSortedTokens } from '../../cached-parse-tree/getSortedTokens.js';
import { VariableAssignmentScope } from '../VariableAssignmentScope.js';
await DataTypes.asyncInit();
const plistTypes = new DataTypes('plist');
const createPList2Names = Command.getLowerCaseCommandNameSet('createPList2');

/*
This adds scopes with singleValue for a special case involving property lists.

It is common to write a sequence like this for a gradient which is what makes this useful:
make "colorStops createPList
setProperty "colorStops 0 "red
setProperty "colorStops 1 "blue
setFillRadialGradient pos pos 100 :colorStops "pad

Making singleValue available for such a case should help WebLogo give Logo programmers 
clear feedback so they learn how to create a valid property list value.
*/

function isSetPropertyCallInRange(fromToken, toToken, plistVariableName, cachedParseTree) {
	const sortedTokens = getSortedTokens(cachedParseTree);
	const fromIndex = getSortedTokenIndex(cachedParseTree, fromToken);
	const toIndex = getSortedTokenIndex(cachedParseTree, toToken);
	for (let i = fromIndex; i < toIndex; i++) {
		const token = sortedTokens[i];
		if (token.children.length === 3 && token.children[0].isStringLiteral() &&
		token.children[0].val.toLowerCase() === plistVariableName &&
		CommandCalls.tokenMatchesPrimaryName(token, 'setProperty'))
			return true;
	}
	return false;
}

export function addScopesForPropertyLists(result, cachedParseTree, tokenValueMap) {
	const createPListCalls = cachedParseTree.getCommandCallsByNames(['createPList', 'createPList2']).
		filter(tok => tok.parentNode !== null &&
			tok.parentNode.children[0].isStringLiteral() &&
			tok.parentNode.nextSibling !== null &&
			CommandCalls.tokenMatchesPrimaryNames(tok.parentNode, ['make', 'localmake']));
	createPListCalls.forEach(function(createPListCall) {
		const makeToken = createPListCall.parentNode;
		const variableName = makeToken.children[0].val.toLowerCase();
		const variable = result.getVariableByName(variableName);
		const procedure = getProcedureFromAnyTokenInProcedure(createPListCall);
		let scopes = variable.getScopesAt(makeToken.nextSibling, procedure);
		if (scopes.length > 0) {
			let n = createPListCall.parentNode.nextSibling;
			const singleValue = new Map();
			if (createPList2Names.has(createPListCall.val.toLowerCase())) {
				const val = tokenValueMap.get(createPListCall.children[0]);
				if (!(val instanceof Array)) {
					return; // do nothing.
				}
				else {
					for (const pair of val) {
						if (pair instanceof Array && pair.length === 2)
							singleValue.set(pair[0], pair[1]);
						else
							return;
					}
				}
			}
			let giveUp = false;
			for (; CommandCalls.tokenMatchesPrimaryName(n, 'setProperty'); n = n.nextSibling) {
				if (n.children.length !== 3 || !n.children[0].isStringLiteral() ||
				n.children[0].val.toLowerCase() !== variableName) {
					giveUp = true;
					break;
				}
				const propKey = tokenValueMap.get(n.children[1]);
				const propVal = tokenValueMap.get(n.children[2]);
				if (propKey === undefined || propVal === undefined) {
					giveUp = true;
					break;
				}
				singleValue.set(propKey, propVal);
			}
			if (n !== null && giveUp === false) {
				scopes = variable.getScopesAt(n, procedure);
				if (scopes.length === 1) {
					const scope = scopes[0];
					if (!isSetPropertyCallInRange(n, scope.toToken, variableName, cachedParseTree)) {
						if (n === scope.fromToken) // identical interval so no need to make new scope.
							scope.singleValue = singleValue;
						else {
							const newScope = new VariableAssignmentScope(n.previousSibling, n, scope.toToken, plistTypes, scope.requiredTypes,
								procedure, false, singleValue);
							scope.toToken = n.previousSibling;
							variable.addScope(newScope);
						}
					}
				}
			}
		}
	});
};