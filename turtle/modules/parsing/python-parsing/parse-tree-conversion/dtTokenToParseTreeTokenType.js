import { isPythonIdentifier } from './isPythonIdentifier.js';
import { isPythonOperator } from './isPythonOperator.js';
import { isNumber } from '../../../isNumber.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const constructorNameToTypeMap = new Map([
	['ArglistContext', ParseTreeTokenType.ARGUMENT_LIST],
	['Assert_stmtContext', ParseTreeTokenType.ASSERT],
	['ClassdefContext', ParseTreeTokenType.CLASS],
	['File_inputContext', ParseTreeTokenType.TREE_ROOT],
	['FuncdefContext', ParseTreeTokenType.FUNCTION_DEFINITION],
	['For_stmtContext', ParseTreeTokenType.FOR_LOOP],
	['If_stmtContext', ParseTreeTokenType.IF_STATEMENT],
	['Import_as_nameContext', ParseTreeTokenType.IMPORT],
	['Import_as_namesContext', ParseTreeTokenType.IMPORT],
	['Import_fromContext', ParseTreeTokenType.IMPORT],
	['Import_nameContext', ParseTreeTokenType.IMPORT],
	['Import_stmtContext', ParseTreeTokenType.IMPORT],
	['ListmakerContext', ParseTreeTokenType.LIST_LITERAL],
	['Print_stmtContext', ParseTreeTokenType.PRINT],
	['Try_stmtContext', ParseTreeTokenType.TRY],
	['While_stmtContext', ParseTreeTokenType.WHILE_LOOP],
	['With_itemContext', ParseTreeTokenType.WITH],
	['With_stmtContext', ParseTreeTokenType.WITH]
]);
const valToType = new Map([
	['=', ParseTreeTokenType.ASSIGNMENT_OPERATOR],
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
	['.', ParseTreeTokenType.DOT],
	[',', ParseTreeTokenType.COMMA],
	[':', ParseTreeTokenType.COLON],
	['break', ParseTreeTokenType.BREAK],
	['continue', ParseTreeTokenType.CONTINUE],
	['def', ParseTreeTokenType.DEF],
	['else', ParseTreeTokenType.ELSE],
	['False', ParseTreeTokenType.BOOLEAN_LITERAL],
	['global', ParseTreeTokenType.GLOBAL],
	['in', ParseTreeTokenType.IN],
	['not', ParseTreeTokenType.NOT],
	['None', ParseTreeTokenType.NONE],
	['pass', ParseTreeTokenType.PASS],
	['return', ParseTreeTokenType.RETURN],
	['True', ParseTreeTokenType.BOOLEAN_LITERAL]
]);

function getTypeForCompOp(token) {
	const opSymbol = getSingleDeepestDescendentText(token);
	if (opSymbol === 'in')
		return ParseTreeTokenType.IN;

	return ParseTreeTokenType.BINARY_OPERATOR;
}

function getSingleDeepestDescendentText(token) {
	while (token.children !== undefined && token.children.length === 1)
		token = token.children[0];
	if (token.symbol !== undefined)
		return token.symbol.text;
}

function getTypeForTerminalNodeImplToken(token) {
	const text = token.symbol.text;
	if (text.startsWith('"') || text.startsWith('\'')) {
		if ((text.startsWith('"""') && text.endsWith('"""')) ||
		(text.startsWith('\'\'\'') && text.endsWith('\'\'\''))) {
			return ParseTreeTokenType.LONG_STRING_LITERAL;
		}
		return ParseTreeTokenType.STRING_LITERAL;
	}
	const type = valToType.get(text);
	if (type !== undefined)
		return type;
	const parseFloatResult = parseFloat(text);
	if (isNumber(parseFloatResult))
		return ParseTreeTokenType.NUMBER_LITERAL;
	if (isPythonOperator(text)) {
		if (text !== '-')
			return ParseTreeTokenType.BINARY_OPERATOR;
		else if (token.parentCtx.constructor.name === 'Arith_exprContext' && token.parentCtx.children.length === 3) {
			return ParseTreeTokenType.BINARY_OPERATOR;
		}
		else
			return ParseTreeTokenType.UNARY_OPERATOR;
	}
	if (token.parentCtx.constructor.name === 'AugassignContext')
		return ParseTreeTokenType.ASSIGNMENT_OPERATOR;
	if (isPythonIdentifier(text))
		return ParseTreeTokenType.IDENTIFIER;
	return ParseTreeTokenType.UNRECOGNIZED;
}

function getTypeForAtomContextToken(token) {
	if (token.children.length >= 2) {
		const firstChild = token.children[0];
		const lastChild = token.children[token.children.length - 1];
		if (firstChild.symbol !== undefined &&
		lastChild.symbol !== undefined) {
			if (firstChild.symbol.text === '[' &&
			lastChild.symbol.text === ']')
				return ParseTreeTokenType.LIST_LITERAL;
			if (firstChild.symbol.text === '(' &&
			lastChild.symbol.text === ')') {
				return ParseTreeTokenType.TUPLE_LITERAL;
			}
		}
	}
	return ParseTreeTokenType.UNRECOGNIZED;
}

function getTypeForAtomExprContextToken(token) {
	if (token.children.length === 2) {
		const funcName = getSingleDeepestDescendentText(token.children[0]);
		if (funcName === 'print')
			return ParseTreeTokenType.PRINT;
		else
			return ParseTreeTokenType.FUNCTION_CALL;
	}
	return ParseTreeTokenType.UNRECOGNIZED;
}

function getTypeForTrailerContextToken(token) {
	if (token.children.length === 3 &&
	getSingleDeepestDescendentText(token.children[0]) === '[' &&
	token.children[1].constructor.name === 'SubscriptlistContext' &&
	getSingleDeepestDescendentText(token.children[2]) === ']'
	) {
		return ParseTreeTokenType.SUBSCRIPT;
	}
	return ParseTreeTokenType.UNRECOGNIZED;
}

export function dtTokenToParseTreeTokenType(token) {
	const constructorName = token.constructor.name;
	if (constructorNameToTypeMap.has(constructorName)) {
		const result = constructorNameToTypeMap.get(constructorName);
		return result;
	}
	if (token.parentCtx === null)
		return ParseTreeTokenType.TREE_ROOT;
	if (constructorName === 'Comp_opContext')
		return getTypeForCompOp(token);
	if (constructorName === 'TerminalNodeImpl')
		return getTypeForTerminalNodeImplToken(token);
	if (constructorName === 'TrailerContext')
		return getTypeForTrailerContextToken(token);
	if (constructorName === 'AtomContext')
		return getTypeForAtomContextToken(token);
	if (constructorName === 'Atom_exprContext')
		return getTypeForAtomExprContextToken(token);
	//console.error('Unable to get type for ', token);
	return ParseTreeTokenType.UNRECOGNIZED;

};