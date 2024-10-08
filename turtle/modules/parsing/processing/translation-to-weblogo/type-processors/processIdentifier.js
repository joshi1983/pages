import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { ProcessingIdentifiers } from
'../../ProcessingIdentifiers.js';

function getDescendentInfo(children) {
	if (children.length !== 1)
		return;
	let first = children[0];
	if (first.type !== ParseTreeTokenType.DOT)
		return;
	children = first.children;
	if (children.length !== 1)
		return;
	first = children[0];
	if (first.type !== ParseTreeTokenType.IDENTIFIER)
		return;
	return ProcessingIdentifiers.getIdentifierInfo(first.val, true);
}

export function processIdentifier(token, result, settings) {
	const children = token.children;
	if (children.length === 1) {
		const info = getDescendentInfo(children);
		if (info !== undefined) {
			const name = info.to === undefined ? info.toProc : info.to;
			result.append(` ${name} `);
			result.append(` :${token.val} `);
		}
		return;
	}
	const info = ProcessingIdentifiers.getIdentifierInfo(token.val, false);
	result.append(' ');
	if (info === undefined) {
		result.append(` :${token.val} `);
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