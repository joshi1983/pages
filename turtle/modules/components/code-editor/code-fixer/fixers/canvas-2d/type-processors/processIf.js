import { isAlwaysTrue } from './function-calls/isAlwaysTrue.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processJavaScriptGeneralToken } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processJavaScriptGeneralToken.js';
import { processToken } from './processToken.js';
import { processTokens } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/helpers/processTokens.js';

const processConcrete = processJavaScriptGeneralToken(processToken);
const bracketTypes = new Set([
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET
]);

function isNotBracket(token) {
	return !bracketTypes.has(token.type);
}

export function processIf(token, result, settings) {
	const conditionToken = token.children[0];
	const blockToken = token.children[1];
	if (isAlwaysTrue(conditionToken)) {
		if (blockToken !== undefined) {
			const filteredChildren = blockToken.children.filter(isNotBracket);
			processTokens(processToken, filteredChildren, result, settings);
		}
	}
	else {
		processConcrete(token, result, settings);
	}
};