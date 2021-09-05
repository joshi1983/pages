import { getIdentifierDescendentInfo } from
'../../parsing/parse-tree-analysis/variable-data-types/getIdentifierDescendentInfo.js';
import { isPropertyReadToken, processPropertyRead } from './processPropertyRead.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { ProcessingIdentifiers } from
'../../ProcessingIdentifiers.js';
import { processToken } from
'./processToken.js';

export function processIdentifier(token, result, settings) {
	const children = token.children;
	if (children.length === 1) {
		const child = children[0];
		if (child.type === ParseTreeTokenType.UNARY_OPERATOR &&
		(child.val === '++' || child.val === '--')) {
			processToken(child, result, settings);
			return;
		}
		const info = getIdentifierDescendentInfo(children);
		if (info !== undefined) {
			const name = info.to === undefined ? info.toProc : info.to;
			result.trimRight();
			result.append(` ${name} `);
			result.append(` :${token.val} `);
		}
		else if (isPropertyReadToken(token)) {
			processPropertyRead(token, result, settings);
		}
		return;
	}
	const info = ProcessingIdentifiers.getIdentifierInfo(token.val, false);
	result.trimRight();
	result.append(' ');
	if (info === undefined) {
		result.append(`:${token.val} `);
	}
	else {
		if (info.toInline !== undefined)
			result.append(info.toInline);
		else if (info.to !== undefined)
			result.append(info.to);
		else
			result.append(token.val);
	}
	result.append(' ');
};