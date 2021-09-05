const typeNames = [];

export class ParseTreeTokenType {

	static getNameFor(typeInteger) {
		return typeNames[typeInteger];
	}
};

const enumKeys = [
	'ARG_LIST',
	'AT_RULE', // for example, @media, @charset...
	'ATTRIBUTE_SELECTOR',
	'BINARY_OPERATOR', // for use in calc expressions like calc(1 - var(--j))
	'CLASS_NAME_SELECTOR', // for example, .my-class
	'COLON',
	'COLOR_LITERAL',
	'COMBINATOR', // for use in selector expressions like p + strong {font-weight: bold;}
	'COMMA',
	'COMMENT',
	'CURLY_LEFT_BRACKET',
	'CURLY_RIGHT_BRACKET',
	'CURVED_BRACKET_EXPRESSION',
	'CURVED_LEFT_BRACKET',
	'CURVED_RIGHT_BRACKET',
	'DECLARATION',
	'DECLARATION_BLOCK',
	'DOT',
	'FUNCTION_CALL',
	'ID_SELECTOR',
	'IDENTIFIER',
	'IMPORTANT', // For example, color: red !important;
	'NUMBER_LITERAL',
	'NUMBER_UNIT_LITERAL', // a number with a unit like 40px
	'PSEUDO_CLASS', // for example, ::before, :target, :nth-child
	'RULE_SET',
	'SELECTOR',
	'SEMICOLON',
	'SQUARE_LEFT_BRACKET',
	'SQUARE_RIGHT_BRACKET',
	'STRING_LITERAL',
	'TREE_ROOT',
	'UNARY_OPERATOR', // for example, 'not'.
	'UNMATCHED', // for tolerating unusual CSS characters and unsupported token types.
	'VALUE',
	'WILDCARD',
];

enumKeys.forEach(function(key, index) {
	ParseTreeTokenType[key] = index + 1;
});

const keys = Object.keys(ParseTreeTokenType).filter(key => Number.isInteger(ParseTreeTokenType[key]));
keys.forEach(function(key) {
	typeNames[ParseTreeTokenType[key]] = key;
});