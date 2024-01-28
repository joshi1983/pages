import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const dataTypes = [
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
];

export class DataType {
	constructor(name) {
		this.name = name;
	}

	static mayBeData(token) {
		return dataTypes.has(token.type);
	}

	toString() {
		return this.name;
	}
};