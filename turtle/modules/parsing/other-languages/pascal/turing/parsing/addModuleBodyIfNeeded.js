import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nextTypesNeedingModuleBody = new Set([
	ParseTreeTokenType.BODY,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.DEFERRED,
	ParseTreeTokenType.END,
	ParseTreeTokenType.EXPORT,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.PROCEDURE,
	ParseTreeTokenType.VAR
]);

function shouldCreateModuleBody(prev, next) {
	if (prev.type !== ParseTreeTokenType.MODULE)
		return false;

	const children = prev.children;
	if (children.some(c => c.type === ParseTreeTokenType.MODULE_BODY))
		return false;
	
	if (nextTypesNeedingModuleBody.has(next.type))
		return true;

	return false;
}

export function addModuleBodyIfNeeded(prev, next) {
	if (shouldCreateModuleBody(prev, next)) {
		const moduleBody = new ParseTreeToken(null, next.lineIndex, next.colIndex,
		ParseTreeTokenType.MODULE_BODY);
		prev.appendChild(moduleBody);
		return moduleBody;
	}
	return prev;
};