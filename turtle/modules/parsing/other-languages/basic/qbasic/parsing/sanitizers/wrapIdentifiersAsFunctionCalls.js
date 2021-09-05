import { filterBracketsAndCommas } from
'../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from
'../../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const uninterestingParentTypes = new Set([
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.SUB,
]);

/*
Checks if there is at least 1 argument expected by the indicated function or subroutine.

This is done because an expected argument such as f(123)
should be wrapped in brackets and parsed properly before this fixer is invoked.
The lack of required parameters indicates we shouldn't apply this fix.
*/
function hasAtLeastOneArgument(funcSubToken) {
	const argList = funcSubToken.children[1];
	if (argList.type === ParseTreeTokenType.ARG_LIST) {
		const args = filterBracketsAndCommas(argList.children);
		if (args.length !== 0)
			return true;
	}
	return false;
}

function subToName(subToken) {
	const children = subToken.children;
	if (children.length > 1) {
		const firstChild = children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER) {
			if (hasAtLeastOneArgument(subToken))
				return;
			return firstChild.val.toLowerCase();
		}
	}
}

function isOfInterest(root) {
	// Create a set of custom function and subroutine names.
	const subs = getDescendentsOfType(root, ParseTreeTokenType.SUB);
	const subNames = new Set(subs.map(subToName).
		filter(name => typeof name === 'string'));

	return function(identifier) {
		const parent = identifier.parentNode;
		if (uninterestingParentTypes.has(parent.type))
			return false;
		return subNames.has(identifier.val.toLowerCase());
	};
}

export function wrapIdentifiersAsFunctionCalls(root) {
	const identifiers = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).
		filter(isOfInterest(root));
	identifiers.forEach(function(identifier) {
		const funcCall = new ParseTreeToken(null, identifier.lineIndex,
			identifier.colIndex, ParseTreeTokenType.FUNCTION_CALL);
		const argList = new ParseTreeToken(null, identifier.lineIndex,
			identifier.colIndex, ParseTreeTokenType.ARG_LIST);
		const idParent = identifier.parentNode;
		idParent.replaceChild(identifier, funcCall);
		funcCall.appendChild(identifier);
		funcCall.appendChild(argList);
	});
};