import { getParameterNamesFromFunctionArguments } from './helpers/getParameterNamesFromFunctionArguments.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const ignoredCodeBlockTypes = new Set([
ParseTreeTokenType.CURLY_LEFT_BRACKET,
ParseTreeTokenType.CURLY_RIGHT_BRACKET
]);

function getFunctionName(token) {
	const child = token.children[0];
	if (child !== undefined) {
		return child.val;
	}
	return 'p';
}

export function processFunction(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result, settings) {
		result.processCommentsUpToToken(token);
		const functionName = getFunctionName(token);
		const parameterNames = getParameterNamesFromFunctionArguments(token.children[1]);
		const codeBlock = token.children[2];
		result.append('\nto ' + functionName);
		for (let i = 0; i < parameterNames.length; i++) {
			result.append(' ');
			result.append(':' + parameterNames[i]);
		}
		if (codeBlock !== undefined) {
			const children = codeBlock.children;
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				result.processCommentsUpToToken(child);
				if (!ignoredCodeBlockTypes.has(child.type)) {
					result.append('\n\t');
					processToken(child, result, settings);
				}
			}
		}
		result.append('\nend\n');
	};
};