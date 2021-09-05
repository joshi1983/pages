const typeNames = [];

export class ParseTreeTokenType {
	static getNameFor(type) {
		return typeNames[type];
	}
};

[
'COLON',
'COMMA',
'COMMENT',
'DO_WHILE',
'FOREVER', 
// forever is not part of ASM Turtle but it is used only after jump conversion translates 
// some jumps in the parse tree to more WebLogo-type structures like a call to WebLogo's forever command.

'IF',
'IF_ELSE',
'INSTRUCTION',
'INSTRUCTION_LIST',
'LABEL',
'LABEL_ANCHOR',
'NUMBER_LITERAL',
'PROC_START',
'TREE_ROOT',
'VAR_DECLARATIONS',
'VARIABLE_REFERENCE',
'WHILE',
].forEach(function(key, index) {
	index++;
	ParseTreeTokenType[key] = index;
	typeNames[index] = key;
});