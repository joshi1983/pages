import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processDef(prev, next) {
	const functionDef = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.FUNCTION_DEFINITION);
	if (prev.type === ParseTreeTokenType.ASYNC ||
	prev.type === ParseTreeTokenType.DECORATOR) {
		const tok = prev;
		prev = prev.parentNode;
		tok.remove();
		functionDef.appendChild(tok);
	}
	functionDef.appendChild(next);
	prev.appendChild(functionDef);
	return functionDef;
};