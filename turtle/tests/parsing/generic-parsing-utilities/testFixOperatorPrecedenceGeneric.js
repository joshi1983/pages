import { checkTreeInfo } from
'../../helpers/parsing/checkTreeInfo.js';
import { fixOperatorPrecedenceGeneric } from
'../../../modules/parsing/generic-parsing-utilities/fixOperatorPrecedenceGeneric.js';
import { flatten } from
'../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { GenericOperators } from
'../../../modules/parsing/generic-parsing-utilities/GenericOperators.js';
import { ParseTreeToken } from
'../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

const typeKeys = ['BINARY_OPERATOR', 'NUMBER_LITERAL', 'TREE_ROOT', 'UNARY_OPERATOR'];

// Some definitions for a mock programming language that we'll test with.
class ParseTreeTokenType {	
	static getNameFor(intVal) {
		return typeKeys[intVal];
	}
};
typeKeys.forEach(function(key, index) {
	ParseTreeTokenType[key] = index;
});

const operators = [
{
	'symbol': '+',
	'precedence': 2,
},
{
	'symbol': '*',
	'precedence': 3
}
];

const Operators = new GenericOperators(operators);

// Returns a single root token.  This would be for code that is empty.
function getRootOnly() {
	return new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
}

// Returns a parse tree root for code similar to: 2+5
function getSingleBinaryOperator(operatorSymbol) {
	if (typeof operatorSymbol !== 'string')
		throw new Error(`operatorSymbol must be a string but found ${operatorSymbol}`);

	const root = getRootOnly();
	const leftOperand = new ParseTreeToken('2', 0, 1, ParseTreeTokenType.NUMBER_LITERAL);
	const op = new ParseTreeToken(operatorSymbol, 0, 2, ParseTreeTokenType.BINARY_OPERATOR);
	const rightOperand = new ParseTreeToken('5', 0, 3, ParseTreeTokenType.NUMBER_LITERAL);
	op.appendChild(leftOperand);
	op.appendChild(rightOperand);
	root.appendChild(op);
	return root;
}

// similar to expression: 2+5*12
function getSimpleExpression1() {
	const root = getSingleBinaryOperator('+');
	const plusToken = root.children[0];
	const fiveOperand = plusToken.children[1];
	const op = new ParseTreeToken('*', 0, 2, ParseTreeTokenType.BINARY_OPERATOR);
	const rightOperand = new ParseTreeToken('12', 0, 3, ParseTreeTokenType.NUMBER_LITERAL);
	fiveOperand.remove();
	op.appendChild(fiveOperand);
	op.appendChild(rightOperand);
	plusToken.appendChild(op);
	return root;
}

// similar to expression: 2*5+12
function getSimpleExpression2() {
	const root = getSingleBinaryOperator('*');
	const multiplyToken = root.children[0];
	const fiveOperand = multiplyToken.children[1];
	const addToken = new ParseTreeToken('+', 0, 2, ParseTreeTokenType.BINARY_OPERATOR);
	const rightOperand = new ParseTreeToken('12', 0, 3, ParseTreeTokenType.NUMBER_LITERAL);
	addToken.appendChild(multiplyToken);
	addToken.appendChild(rightOperand);
	while (root.children.length !== 0)
		root.removeChild(root.children[0]);

	root.appendChild(addToken);
	return root;
}

export function testFixOperatorPrecedenceGeneric(logger) {
	const cases = [
		{'similarCode': '', 'root': getRootOnly(), 'numTopChildren': 0},
		{'similarCode': '2+5', 'root': getSingleBinaryOperator('+'), 'numTopChildren': 1,
			'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]
			}
		},
		{'similarCode': '2*5', 'root': getSingleBinaryOperator('*'), 'numTopChildren': 1,
			'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]
			}
		},
		{'similarCode': '2+5*12', 'root': getSimpleExpression1(), 'numTopChildren': 1,
			'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': '12', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
						]}
					]}
				]
			}
		},
		{'similarCode': '2*5+12', 'root': getSimpleExpression2(), 'numTopChildren': 1,
			'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
						]},
						{'val': '12', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]
			}
		},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}. Similar code=${caseInfo.similarCode}`, logger);
		const rootToken = caseInfo.root;
		const allTokens = flatten(rootToken);
		fixOperatorPrecedenceGeneric(allTokens,
			[ParseTreeTokenType.BINARY_OPERATOR],
			Operators.compareOperatorPrecedence);
		if (caseInfo.numTopChildren !== undefined &&
		caseInfo.numTopChildren !== rootToken.children.length)
			plogger(`Expected numTopChildren of ${caseInfo.numTopChildren} but found ${rootToken.children.length}`);
		if (caseInfo.treeInfo !== undefined)
			checkTreeInfo(rootToken, caseInfo.treeInfo, plogger, ParseTreeTokenType);
	});
};