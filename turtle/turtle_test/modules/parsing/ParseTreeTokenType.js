export class ParseTreeTokenType {
	static LEAF = 0;
	static LIST = 1;
	static CURVED_BRACKET_EXPRESSION = 2;
	static VARIABLE_READ = 3;
	static BOOLEAN_LITERAL = 4;
	static NUMBER_LITERAL = 5;
	static STRING_LITERAL = 6;
	static LONG_STRING_LITERAL = 7;
	static UNARY_OPERATOR = 8;
	static BINARY_OPERATOR = 9;
	static NEW_LINE = 10;
	static PROCEDURE_START_KEYWORD = 11; // example: "to"
	static PROCEDURE_END_KEYWORD = 12;
	static PARAMETERIZED_GROUP = 13;
	static TREE_ROOT = 14;
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