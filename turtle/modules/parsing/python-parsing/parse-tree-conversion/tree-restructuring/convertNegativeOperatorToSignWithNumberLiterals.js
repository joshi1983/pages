import { convertChildren } from './helpers/convertChildren.js';
import { isUnaryOperatorShouldBecomeBinary } from './convertSomeUnaryOperatorsToBinary.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function shouldBeConverted(token) {
	if (isUnaryOperatorShouldBecomeBinary(token))
		return false;
	if (token.type !== ParseTreeTokenType.UNARY_OPERATOR ||
	token.parentNode === null ||
	token.val !== '-' ||
	token.children.length !== 1 ||
	token.children[0].type !== ParseTreeTokenType.NUMBER_LITERAL)
		return false;
	return true;
}

export function convertNegativeOperatorToSignWithNumberLiterals(token) {
	let result = false;
	if (shouldBeConverted(token)) {
		const numberLiteral = token.children[0];
		const parent = token.parentNode;
		numberLiteral.val = '-' + numberLiteral.val;
		parent.replaceChild(token, numberLiteral);
		result = true;
	}
	if (convertChildren(token, convertNegativeOperatorToSignWithNumberLiterals))
		result = true;
	return result;
};