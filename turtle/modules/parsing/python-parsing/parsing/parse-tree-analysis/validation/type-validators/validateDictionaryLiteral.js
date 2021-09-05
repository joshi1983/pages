import { checkFirstAndLastVal } from './checkFirstAndLastVal.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateDictionaryLiteral(token, parseLogger) {
	const children = token.children;
	for (let i = 1; i < children.length - 1; i++) {
		const child = children[i];
		if (child.type !== ParseTreeTokenType.DICTIONARY_KEY_VALUE_PAIR &&
		child.type !== ParseTreeTokenType.COMMA) {
			parseLogger.error(`DICTIONARY_LITERAL child type should be DICTIONARY_KEY_VALUE_PAIR and COMMA surrounded by {...} breckets but found ${ParseTreeTokenType.getNameFor(child.type)}`, token);
		}
	}
	checkFirstAndLastVal(token, '{', '}', parseLogger);
};