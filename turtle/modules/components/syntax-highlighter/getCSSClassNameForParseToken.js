import { Command } from '../../parsing/Command.js';
import { ParseTreeTokenType } from '../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../parsing/Procedure.js';
const typeToClassName = [];
typeToClassName[ParseTreeTokenType.BINARY_OPERATOR] = 'binary-operator';
typeToClassName[ParseTreeTokenType.BOOLEAN_LITERAL] = 'boolean-literal';
typeToClassName[ParseTreeTokenType.NUMBER_LITERAL] = 'number-literal';
typeToClassName[ParseTreeTokenType.STRING_LITERAL] = 'string-literal';
typeToClassName[ParseTreeTokenType.LONG_STRING_LITERAL] = 'string-literal';
typeToClassName[ParseTreeTokenType.PARAMETERIZED_GROUP] = 'parameterized-group';
typeToClassName[ParseTreeTokenType.PROCEDURE_END_KEYWORD] = 'keyword';
typeToClassName[ParseTreeTokenType.PROCEDURE_START_KEYWORD] = 'keyword';
typeToClassName[ParseTreeTokenType.UNARY_OPERATOR] = 'unary-operator';
typeToClassName[ParseTreeTokenType.NEW_LINE] = null; // indicate not to set a class

const valMap = {
	'[': 'square-bracket',
	']': 'square-bracket',
	'(': 'curved-bracket',
	')': 'curved-bracket',
};

export function getCSSClassNameForParseToken(token) {
	const typeResult = typeToClassName[token.type];
	if (typeResult !== undefined) {
		if (typeResult === null)
			return undefined;
		else
			return typeResult;
	}
	if (token.type === ParseTreeTokenType.LEAF) {
		if (Procedure.isNameToken(token))
			return 'procedure-name';
		else if (Command.getCommandInfo(token.val) !== undefined)
			return 'ungrouped-command';
		else
			return valMap[token.val];
	}
	if (token.type === ParseTreeTokenType.VARIABLE_READ) {
		if (Procedure.isParameterToken(token))
			return 'procedure-parameter';
		else
			return 'variable-read';
	}
};