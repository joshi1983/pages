import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function processColon(prev, next) {
	if (prev.type === ParseTreeTokenType.IDENTIFIER ||
	prev.type === ParseTreeTokenType.COMPOSITE_IDENTIFIER) {
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, next);
		next.type = ParseTreeTokenType.ASSIGNMENT;
		next.appendChild(prev);
	}
	else {
		prev.appendChild(next);
	}
	return next;
};