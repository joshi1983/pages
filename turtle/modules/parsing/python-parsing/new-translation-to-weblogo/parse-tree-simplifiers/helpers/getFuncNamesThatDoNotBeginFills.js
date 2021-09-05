import { CachedParseTree } from
'../../../parse-tree-analysis/CachedParseTree.js';
import { getAllFunctionDefinitions } from
'../../../parse-tree-analysis/getAllFunctionDefinitions.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from
'../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { isBeginFillCall } from './isBeginFillCall.js';
import { isEndFillCall } from './isEndFillCall.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

/*
Returns a function that returns true or false.
	The result is true if the specified function definition might open a shape without closing it.
*/
function mightDefinitionBeginFill(customFuncNames, funcNamesThatDoNotBeginFills) {
	return function(def) {
		// look at the code block.
		const codeBlock = def.getInstructionsToken();
		const returnTokens = getDescendentsOfTypes(codeBlock, [ParseTreeTokenType.RETURN, ParseTreeTokenType.YIELD]);
		if (returnTokens.length === 0) {
			let tok = codeBlock.children[codeBlock.children.length - 1];
			while (tok !== null) {
				if (isEndFillCall(tok))
					return false;
				if (tok.type === ParseTreeTokenType.IDENTIFIER &&
				tok.children.length === 1) {
					const dotToken = tok.children[0];
					if (dotToken.type === ParseTreeTokenType.DOT &&
					dotToken.children.length === 1) {
						const grandChild = dotToken.children[0];
						if (isEndFillCall(grandChild))
							return false;
						if (isBeginFillCall(grandChild))
							return true;
					}
				}
				if (isBeginFillCall(tok))
					return true;
				if (tok.type !== ParseTreeTokenType.FUNCTION_DEFINITIION) {
					const descendentBeginFillCalls = getDescendentsOfType(tok, ParseTreeTokenType.FUNCTION_CALL).
						filter(isBeginFillCall);
					if (descendentBeginFillCalls.length !== 0)
						return true;
					if (tok.type === ParseTreeTokenType.FUNCTION_CALL && tok.val !== def.name &&
					customFuncNames.has(tok.val) &&
					!funcNamesThatDoNotBeginFills.has(tok.val)) {
						break;
					}
				}
				tok = tok.getPreviousSibling();
			}
		}
		const descendentFuncCalls = getDescendentsOfType(codeBlock, ParseTreeTokenType.FUNCTION_CALL);
		if (descendentFuncCalls.some(t => customFuncNames.has(t.val) && t.val !== def.name &&
			!funcNamesThatDoNotBeginFills.has(t.val))) {
			if (!descendentFuncCalls.some(isBeginFillCall))
				return false;
			return true;
		}
		return false;
	};
}

export function getFuncNamesThatDoNotBeginFills(root) {
	if (typeof root !== 'object' || root.parentNode === undefined)
		throw new Error(`root must be a ParseTreeToken but found something else.  root=${root}`);

	let customFuncNames = new Set();
	let funcNamesThatDoNotBeginFills = new Set();
	const cachedParseTree = new CachedParseTree(root);
	const definitions = getAllFunctionDefinitions(cachedParseTree);
	customFuncNames = new Set(definitions.map(def => def.name));
	for (const name of customFuncNames) {

		// Although rare, there may be more than one definition matching a given name.
		// The definitions might be duplicated or one may be nested into a local scope 
		// that doesn't clash with another definition by the same name.
		// That is why this code accommodates multiple matching definitions.
		const matchingDefinitions = definitions.filter(def => def.name === name);

		let notBeginningFill = !matchingDefinitions.some(mightDefinitionBeginFill(customFuncNames, funcNamesThatDoNotBeginFills));
		if (notBeginningFill)
			funcNamesThatDoNotBeginFills.add(name);
	}

	return {
		'customFuncNames': customFuncNames,
		'funcNamesThatDoNotBeginFills': funcNamesThatDoNotBeginFills
	};
};