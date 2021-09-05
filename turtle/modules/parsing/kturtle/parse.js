import { addToken } from './parsing/addToken.js';
import { fixOperatorPrecedenceGeneric } from '../generic-parsing-utilities/fixOperatorPrecedenceGeneric.js';
import { flatten } from '../generic-parsing-utilities/flatten.js';
import { getProceduresMap } from './getProceduresMap.js';
import { KTurtleOperators } from './KTurtleOperators.js';
import { ParseTreeToken } from '../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { scan } from './scanning/scan.js';
import { shallowCloneToken } from '../generic-parsing-utilities/shallowCloneToken.js';
import { stringToParseTreeTokenType } from './stringToParseTreeTokenType.js';

function createRootToken() {
	return new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
}

export function parse(code) {
	const tokens = scan(code);
	const comments = [];
	const declarations = [];
	const wrapTokens = [];
	let isWrapped = false;
	const result = createRootToken();
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const pToken = new ParseTreeToken(token.s, token.lineIndex, token.colIndex, stringToParseTreeTokenType(token.s));
		if (pToken.type === ParseTreeTokenType.COMMENT)
			comments.push(pToken);
		else if (pToken.type === ParseTreeTokenType.KTURTLE_VERSION_DECLARATION)
			declarations.push(pToken);
		else if (pToken.type === ParseTreeTokenType.WRAP_START) {
			isWrapped = true;
			wrapTokens.push(pToken);
		}
		else if (pToken.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET && isWrapped) {
			isWrapped = false;
			wrapTokens.push(pToken);
		}
		else {
			result.appendChild(pToken);
		}
	}
	const procedures = getProceduresMap(result);
	const result2 = createRootToken();
	let prevToken = result2;
	const children = result.children;
	// second parsing pass.
	for (let i = 0; i < children.length; i++) {
		const token = shallowCloneToken(children[i]);
		prevToken = addToken(prevToken, token, procedures);
	}
	const allTokens = flatten(result2);
	fixOperatorPrecedenceGeneric(allTokens, [ParseTreeTokenType.ASSIGNMENT_OPERATOR, ParseTreeTokenType.BINARY_OPERATOR],
		KTurtleOperators.compareOperatorPrecedence);
	return {
		'root': result2,
		'comments': comments,
		'declarations': declarations,
		'wrapTokens': wrapTokens
	};
};