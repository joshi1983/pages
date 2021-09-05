const typeNames = [];

export class ParseTreeTokenType {
	static getNameFor(type) {
		return typeNames[type];
	}
};

[
'BINARY_OPERATOR',
'COMMA',
'COMMAND',
'COMMENT',
'GO',
'IF',
'ELSE',
'END',
'ENDIF',
'INPUT_REFERENCE',
'INSTRUCTION_LIST',
'LET',
'NEXT',
'NUMBER_LITERAL',
'PROC_START',
'REPEAT',
'RETURN',
'TREE_ROOT',
'STRING_LITERAL',
'VARIABLE_REFERENCE',
].forEach(function(key, index) {
	index++;
	ParseTreeTokenType[key] = index;
	typeNames[index] = key;
});