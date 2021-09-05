export class ParseTreeTokenType {

	static getTypeNumbers() {
		const values = Object.values(ParseTreeTokenType);
		return values.filter(v => Number.isInteger(v));
	}

	/* 
	comment tokens are not normally in the parse tree even when the source code contains comments 
	because the comment tokens from the scanner are filtered prior to parsing. 
	comment tokens are used while processing the "Format Code" feature, though.
	*/

	static getNameFor(type) {
		const keys = Object.keys(ParseTreeTokenType);
		for (var i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (ParseTreeTokenType[key] === type)
				return key;
		}
	}

	static nameToNumber(name) {
		return names.indexOf(name);
	}
};

const names = [
	'BINARY_OPERATOR',
	'BOOLEAN_LITERAL',
	'COMMENT',
	'CURVED_BRACKET_EXPRESSION',
	'LEAF',
	'LIST',
	'LONG_STRING_LITERAL',
	'NEW_LINE',
	'NUMBER_LITERAL',
	'PROCEDURE_END_KEYWORD',
	'PROCEDURE_START_KEYWORD', // example: "to"
	'PARAMETERIZED_GROUP',
	'STRING_LITERAL',
	'TREE_ROOT',
	'UNARY_OPERATOR',
	'VARIABLE_READ'
];

for (let i = 0; i < names.length; i++) {
	const name = names[i];
	ParseTreeTokenType[name] = i;
}