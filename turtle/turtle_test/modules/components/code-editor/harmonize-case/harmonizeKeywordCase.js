import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';

export function harmonizeKeywordCase(parseTree) {
	const keywordTokens = parseTree.getTokensByTypes([
		ParseTreeTokenType.PROCEDURE_END_KEYWORD,
		ParseTreeTokenType.PROCEDURE_START_KEYWORD]);
	for (let i = 0; i < keywordTokens.length; i++) {
		const keywordToken = keywordTokens[i];
		const oldValue = keywordToken.val;
		const bestName = oldValue.toLowerCase();
		if (bestName !== oldValue) {
			keywordToken.val = bestName;
			parseTree.tokenValueChanged(keywordToken, oldValue);
		}
	}
};