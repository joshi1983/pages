import { filterBracketsAndCommas } from '../../new-translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const globalNameTokenTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.GLOBAL,
	ParseTreeTokenType.UNRECOGNIZED,
]);

function getGlobalNamesFrom(token, nameSet) {
	if (!globalNameTokenTypes.has(token.type))
		return; // don't get names from nested function definitions.
	else if (token.type === ParseTreeTokenType.GLOBAL) {
		const nameTokens = filterBracketsAndCommas(token.children);
		nameTokens.forEach(nameToken => nameSet.add(nameToken.val));
	}
	else {
		for (const child of token.children) {
			if (!globalNameTokenTypes.has(child.type))
				break;
			getGlobalNamesFrom(child, nameSet);
		}
	}
}

export function getGlobalsFromFunctionDefinition(functionDefinition) {
	if (functionDefinition.globalNameSet === undefined) {
		const names = new Set();
		const codeBlock = functionDefinition.getInstructionsToken();
		getGlobalNamesFrom(codeBlock, names);
		functionDefinition.globalNameSet = names;
	}
	return functionDefinition.globalNameSet;
};