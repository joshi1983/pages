import { assertEquals } from '../../helpers/assertEquals.js';
import { isAfterOrSame } from '../../../modules/parsing/generic-parsing-utilities/isAfterOrSame.js';
import { parse } from '../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeToken } from '../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { leftRotate, rightRotate } from '../../../modules/parsing/generic-parsing-utilities/rotate.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { StringBuffer } from '../../../modules/StringBuffer.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function shouldFirstGoFirst(token) {
	const children = token.children;
	if (children.length !== 1)
		return true;

	if (token.type !== ParseTreeTokenType.BINARY_OPERATOR)
		return true;

	const firstChild = children[0];
	return isAfterOrSame(token, firstChild);
}

function shouldValGoFirst(token) {
	if (token.type !== ParseTreeTokenType.NUMBER_LITERAL)
		return true;

	const children = token.children;
	if (children.length === 0)
		return true; // doesn't matter if it goes first.

	const firstChild = children[0];
	if (isAfterOrSame(token, firstChild))
		return false;

	return true;
}

function stringifyJSParseTree(token) {
	const result = new StringBuffer();
	const children = token.children;
	const firstChild = children[0];
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	firstChild !== undefined) {
		const firstIsFirst = shouldFirstGoFirst(token);
		if (firstIsFirst)
			result.append(stringifyJSParseTree(firstChild));

		result.append(` ${token.val} `);

		if (!firstIsFirst)
			result.append(stringifyJSParseTree(firstChild));

		if (children.length > 1)
			result.append(stringifyJSParseTree(children[1]));
	}
	else {
		const valFirst = shouldValGoFirst(token);
		if (typeof token.val === 'string' && valFirst)
			result.append(` ${token.val} `);
		for (const child of token.children) {
			result.append(stringifyJSParseTree(child));
		}
		if (typeof token.val === 'string' && !valFirst)
			result.append(` ${token.val} `);
	}

	return result.toString().replace(/\s+/, ' ').trim();
}

function testLeftRotate(logger) {
	const rootToken = new ParseTreeToken(null, 0, 0, 1);
	const child1Token = new ParseTreeToken(null, 0, 0, 2);
	const child2Token = new ParseTreeToken(null, 0, 0, 3);
	const grandChild1Token = new ParseTreeToken(null, 0, 0, 4);
	const grandChild2Token = new ParseTreeToken(null, 0, 0, 5);
	const grandChild3Token = new ParseTreeToken(null, 0, 0, 6);
	const grandChild4Token = new ParseTreeToken(null, 0, 0, 7);
	rootToken.appendChild(child1Token);
	rootToken.appendChild(child2Token);
	child2Token.appendChild(grandChild1Token);
	child2Token.appendChild(grandChild2Token);
	child1Token.appendChild(grandChild3Token);
	child1Token.appendChild(grandChild4Token);
	const tokens = [grandChild1Token, grandChild2Token, grandChild3Token, grandChild4Token];
	let typeIndex = 8;
	tokens.forEach(function(token) {
		token.appendChild(new ParseTreeToken(null, 0, 0, typeIndex++));
		token.appendChild(new ParseTreeToken(null, 0, 0, typeIndex++));
	});
	leftRotate(child1Token);
}

function testRightRotate(logger) {
	const rootToken = new ParseTreeToken(null, 0, 0, 1);
	const child1Token = new ParseTreeToken(null, 0, 0, 2);
	const child2Token = new ParseTreeToken(null, 0, 0, 3);
	const grandChild1Token = new ParseTreeToken(null, 0, 0, 4);
	const grandChild2Token = new ParseTreeToken(null, 0, 0, 5);
	const grandChild3Token = new ParseTreeToken(null, 0, 0, 6);
	const grandChild4Token = new ParseTreeToken(null, 0, 0, 7);
	rootToken.appendChild(child1Token);
	rootToken.appendChild(child2Token);
	child2Token.appendChild(grandChild1Token);
	child2Token.appendChild(grandChild2Token);
	child1Token.appendChild(grandChild3Token);
	child1Token.appendChild(grandChild4Token);
	rightRotate(child1Token);
}

function testRotateWithStrings(logger) {
	const cases = [
		'2 + 3 + 4', '1 + 2 + 3 + 4',  '2 * 3 * 4', '1 * 2 * 3 * 4',
		'2 + 3 * 4', '2 * 3 + 4'
	];
	cases.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const parseResult = parse(code);
		const root = parseResult.root;
		if (root.children.length !== 1)
			plogger(`Expected the root token to have 1 child but found ${root.children.length}`);
		else {
			const child = root.children[0];
			const resultString = stringifyJSParseTree(root);
			if (resultString !== code)
				plogger(`The test string ${code} should stringify to the same immediately after parsed but found ${resultString}`);

			leftRotate(child);
			assertEquals(code, stringifyJSParseTree(root), prefixWrapper(`after leftRotate`, plogger));
			const parseResult2 = parse(code);
			rightRotate(parseResult2.root.children[0]);
			assertEquals(code, stringifyJSParseTree(parseResult2.root.children[0]), prefixWrapper(`after rightRotate`, plogger));
		}
	});
}

export function testRotate(logger) {
	wrapAndCall([
		testLeftRotate,
		testRightRotate,
		testRotateWithStrings
	], logger);
};