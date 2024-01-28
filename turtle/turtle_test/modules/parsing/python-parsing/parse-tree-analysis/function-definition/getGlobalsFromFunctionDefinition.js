import { filterBracketsAndCommas } from '../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const globalNameTokenTypes = new Set([
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
		for (let i = 0; i < token.children.length; i++) {
			const child = token.children[i];
			if (!globalNameTokenTypes.has(child.type))
				break;
			getGlobalNamesFrom(child, nameSet);
		}
	}
}

export function getGlobalsFromFunctionDefinition(functionDefinition) {
	if (functionDefinition.globalNameSet === undefined) {
		const names = new Set();
		const instructionsToken = functionDefinition.getInstructionsToken();
		getGlobalNamesFrom(instructionsToken, names);
		functionDefinition.globalNameSet = names;
	}
	return functionDefinition.globalNameSet;
};