import { DataTypeParseToken } from './DataTypeParseToken.js';
import { DataTypeTokenType } from './DataTypeTokenType.js';
import { isName } from './isName.js';
import { scanDataTypeString } from './scanDataTypeString.js';

export function parseDataTypeString(s) {
	const scanTokens = scanDataTypeString(s);
	const root = new DataTypeParseToken(null, DataTypeTokenType.TREE_ROOT);
	let currentToken = root;
	for (let i = 0; i < scanTokens.length; i++) {
		const scanToken = scanTokens[i];
		if (scanToken.s === '<') {
			let nextToken;
			if (scanTokens[i + 1].s === '>')
				nextToken = new DataTypeParseToken(null, DataTypeTokenType.EMPTY_PLACEHOLDER);
			else
				nextToken = new DataTypeParseToken(scanTokens[++i].s, DataTypeTokenType.NAME);
			currentToken.appendChild(nextToken);
			currentToken = nextToken;
		}
		else if (scanToken.s === '>') {
			currentToken = currentToken.parentNode;
		}
		else if (scanToken.s === '*' || isName(scanToken.s)) {
			let type = DataTypeTokenType.NAME;
			if (scanToken.s === '*')
				type = DataTypeTokenType.WILDCARD;
			const nextToken = new DataTypeParseToken(scanToken.s, type);
			if (i > 0 && scanTokens[i - 1].s === '|')
				currentToken.parentNode.appendChild(nextToken);
			else
				currentToken.appendChild(nextToken);
			currentToken = nextToken;
		}
	}
	return root;
};