import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const ignoredParameterChildTypes = new Set([
ParseTreeTokenType.COMMA,
ParseTreeTokenType.CURVED_LEFT_BRACKET,
ParseTreeTokenType.CURVED_RIGHT_BRACKET,
]);

export function getParameterNamesFromFunctionArguments(argsList) {
	if (argsList === undefined)
		return [];
	else {
		const children = argsList.children;
		const result = [];
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (!ignoredParameterChildTypes.has(child.type) &&
			typeof child.val === 'string') {
				result.push(child.val);
			}
		}
		return result;
	}
};