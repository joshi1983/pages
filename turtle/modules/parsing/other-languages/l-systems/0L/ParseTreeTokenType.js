const typeNames = [];

export class ParseTreeTokenType {

	static getNameFor(typeInteger) {
		return typeNames[typeInteger];
	}
};

const enumKeys = [
	'ARROW', // for example -> or --> or --->
	'ASSIGNMENT', // for example, Axiom = F
	'COLON', // for example, :
	'COMMAND_SEQUENCE',
	'COMMAND_SYMBOL', // for example, +, -, [, ], {, }...
	'COMMENT',
	'COMPOSITE_IDENTIFIER', // for example, 'String length' or 'length factor'.
	'IDENTIFIER', // for example, x, X, axiom, Axiom
	'NUMBER_LITERAL',
	'TREE_ROOT',
	'UNRECOGNIZED'
];

enumKeys.forEach(function(key, index) {
	ParseTreeTokenType[key] = index + 1;
});

const keys = Object.keys(ParseTreeTokenType).filter(key => Number.isInteger(ParseTreeTokenType[key]));
keys.forEach(function(key) {
	typeNames[ParseTreeTokenType[key]] = key;
});