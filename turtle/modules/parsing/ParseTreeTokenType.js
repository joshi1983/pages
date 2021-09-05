export class ParseTreeTokenType {
	static BINARY_OPERATOR = 0;
	static BOOLEAN_LITERAL = 1;
	static CURVED_BRACKET_EXPRESSION = 2;
	static LEAF = 3;
	static LIST = 4;
	static LONG_STRING_LITERAL = 5;
	static NEW_LINE = 6;
	static NUMBER_LITERAL = 7;
	static PROCEDURE_START_KEYWORD = 8; // example: "to"
	static PROCEDURE_END_KEYWORD = 9;
	static PARAMETERIZED_GROUP = 10;
	static STRING_LITERAL = 11;
	static TREE_ROOT = 12;
	static UNARY_OPERATOR = 13;
	static VARIABLE_READ = 14;
	static COMMENT = 15;

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
};