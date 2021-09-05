import { isComment } from './scanning/isComment.js';

/*
Ideally, we want to return true any time the corresponding code 
uses true, false as boolean literals.
Getting this correct by analyzing the scanned Token instances
is best because it happens before any parsing.

This works well in some cases.  When this doesn't work, shouldBooleanLiteralBecomeIdentifier
looks at individual ParseTreeToken instances during the parsing process.
*/
export function shouldBooleanLiteralsBeIdentifiers(scanTokens) {
	scanTokens = scanTokens.filter(token => !isComment(token.s));
	for (let i = 1; i < scanTokens.length; i++) {
		const prevS = scanTokens[i - 1].s.toLowerCase();
		const token = scanTokens[i];
		const tokenS = token.s.toLowerCase();
		if (tokenS === 'true' || tokenS === 'false') {
			if (prevS === 'let' || prevS === 'dim' ||
			prevS === 'const')
				return true;
			if (prevS === 'function' || prevS === 'sub' || prevS === 'def') {
				const next = scanTokens[i + 1];
				if (next !== undefined) {
					const nextS = next.s.toLowerCase();
					if (nextS === '(')
						return true;
				}
			}
		}
	}
	return false;
};