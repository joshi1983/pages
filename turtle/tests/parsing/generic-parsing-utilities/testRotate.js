import { leftRotate } from '../../../modules/parsing/generic-parsing-utilities/rotate.js';
import { ParseTreeToken } from '../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

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

export function testRotate(logger) {
	wrapAndCall([
		testLeftRotate
	], logger);
};