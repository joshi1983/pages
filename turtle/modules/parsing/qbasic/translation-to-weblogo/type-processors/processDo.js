import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function processDoLoopWhile(token, result, options) {
	const children = token.children;
	const codeBlock = children[0];
	const loopWhile = children[1];
	const whileToken = loopWhile.children[1];
	const condition = whileToken.children[0];
	result.append('do.while ');
	processToken(codeBlock, result, options);
	processToken(condition, result, options);
}

function processDoLoopUntil(token, result, options) {
	const children = token.children;
	const codeBlock = children[0];
	const loopToken = children[1];
	const untilToken = loopToken.children[0];
	if (untilToken === undefined) {
		result.append('forever ');
		processToken(codeBlock, result, options);
		result.append('\n');
		return;
	}
	const condition = untilToken.children[0];
	result.append('do.while ');
	processToken(codeBlock, result, options);
	result.append('not (');
	processToken(condition, result, options);
	result.append(' )\n');
}

export function processDo(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length === 0)
		return; // invalid QBasic code that can't be translated

	const afterToken = children[1];
	if (afterToken === undefined) // weird case but just process the only child.
		processToken(children[0], result, options);
	else if (afterToken.type === ParseTreeTokenType.LOOP)
		processDoLoopUntil(token, result, options);
	else
		processDoLoopWhile(token, result, options);
};