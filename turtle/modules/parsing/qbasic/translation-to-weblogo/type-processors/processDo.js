import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function processDoLoopWhile(token, result) {
	const children = token.children;
	const codeBlock = children[0];
	const loopWhile = children[1];
	const whileToken = loopWhile.children[1];
	const condition = whileToken.children[0];
	result.append('do.while ');
	processToken(codeBlock, result);
	processToken(condition, result);
}

function processDoLoopUntil(token, result) {
	const children = token.children;
	const codeBlock = children[0];
	const loopToken = children[1];
	const untilToken = loopToken.children[0];
	if (untilToken === undefined) {
		return; // weird case but token is erroneously structured.
		// This could be the result of parsing invalid QBasic code.
	}
	const condition = untilToken.children[0];
	result.append('do.while ');
	processToken(codeBlock, result);
	result.append('not (');
	processToken(condition, result);
	result.append(' )\n');
}

export function processDo(token, result) {
	const children = token.children;
	if (children.length === 0)
		return; // invalid QBasic code that can't be translated

	const afterToken = children[1];
	if (afterToken === undefined) // weird case but just process the only child.
		processToken(children[0]);
	else if (afterToken.type === ParseTreeTokenType.LOOP)
		processDoLoopUntil(token, result);
	else
		processDoLoopWhile(token, result);
};