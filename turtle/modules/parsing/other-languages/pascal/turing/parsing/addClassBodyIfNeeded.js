import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nextTypesNeedingClassBody = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.END,
	ParseTreeTokenType.EXPORT
]);

function shouldCreateClassBody(prev, next) {
	if (prev.type !== ParseTreeTokenType.CLASS)
		return false;

	const children = prev.children;
	if (children.some(c => c.type === ParseTreeTokenType.CLASS_BODY))
		return false;
	
	if (nextTypesNeedingClassBody.has(next.type))
		return true;

	return false;
}

export function addClassBodyIfNeeded(prev, next) {
	if (shouldCreateClassBody(prev, next)) {
		const classBody = new ParseTreeToken(null, next.lineIndex, next.colIndex,
		ParseTreeTokenType.CLASS_BODY);
		prev.appendChild(classBody);
		return classBody;
	}
	return prev;
};