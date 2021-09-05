import { ArrayUtils } from '../../../ArrayUtils.js';
import { CachedParseTree } from '../parse-tree-analysis/CachedParseTree.js';
import { getAllFunctionDefinitions } from '../parse-tree-analysis/getAllFunctionDefinitions.js';
import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
import { getWebLogoSafeFunctionNameFrom } from './getWebLogoSafeFunctionNameFrom.js';
import { isNameSafeInWebLogo } from './isNameSafeInWebLogo.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { tokenToFunctionDefinitionName } from '../parse-tree-analysis/function-definition/tokenToFunctionDefinitionName.js';

function isCallOfInterest(callToken) {
	// If callToken is calling a method, return false.
	if (callToken.parentNode.type === ParseTreeTokenType.DOT)
		return false;

	return true;
}

function isDefinitionOfInterest(namesOfInterest) {
	return function(defToken) {
		const name = tokenToFunctionDefinitionName(defToken);
		if (namesOfInterest.has(name)) {
			return true;
		}
		return false;
	};
}

function getTokensOfInterest(cachedParseTree, fromKeys) {
	fromKeys = new Set(fromKeys);
	let callsOfInterest = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_CALL).
		filter(callToken => fromKeys.has(callToken.val) && isCallOfInterest(callToken));
	let definitionsOfInterest = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_DEFINITION).
		filter(isDefinitionOfInterest(fromKeys)).map(defToken => defToken.children[1]);
	const result = callsOfInterest;
	ArrayUtils.pushAll(result, definitionsOfInterest);
	return result;
}

export class FunctionRename {
	static isNeededFor(cachedParseTree) {
		const definitions = getAllFunctionDefinitions(cachedParseTree);
		const takenNamesLowerCase = new Set();
		return definitions.some(def => {
			if (takenNamesLowerCase.has(def.name.toLowerCase()))
				return true;
			takenNamesLowerCase.add(def.name.toLowerCase());
			return !isNameSafeInWebLogo(def.name);
		});
	}

	static execute(rootToken) {
		if (rootToken.children === undefined)
			throw new Error(`rootToken must be a ParseTreeToken but got ${rootToken}`);
		const renameMap = new Map();
		const cachedParseTree = new CachedParseTree(rootToken);
		const allDefinitions = getAllFunctionDefinitions(cachedParseTree);
		const accomulatingNames = new Set();
		const caseSensitiveNames = new Set();
		const definitions = allDefinitions.forEach(function(def) {
			if (!isNameSafeInWebLogo(def.name) || accomulatingNames.has(def.name.toLowerCase())) {
				const newName = getWebLogoSafeFunctionNameFrom(def.name, accomulatingNames, caseSensitiveNames);
				renameMap.set(def.name, newName);
				caseSensitiveNames.add(newName);
				accomulatingNames.add(newName.toLowerCase());
			}
			else
				accomulatingNames.add(def.name.toLowerCase());
		});
		const tokensToChange = getTokensOfInterest(cachedParseTree, renameMap.keys());
		tokensToChange.forEach(function(tokenToChange) {
			const newName = renameMap.get(tokenToChange.val);
			tokenToChange.val = newName;
		});
	}
};