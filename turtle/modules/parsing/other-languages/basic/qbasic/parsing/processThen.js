import { addCodeBlock } from './addCodeBlock.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ELSEIF,
	ParseTreeTokenType.IF
]);

function moveIfIfNeeded(token) {
	if (token.type !== ParseTreeTokenType.IF) {
		let children = token.children;
		let last = children[children.length - 1];
		if (last === undefined)
			return token;
		const conditionToken = last;
		let prev = children[children.length - 2];
		if (prev === undefined || prev.type !== ParseTreeTokenType.IF)
			return token;
		children = prev.children;
		if (children.length === 0)
			return token;
		const endIf = children[children.length - 1];
		if (endIf.type !== ParseTreeTokenType.END_IF)
			return token;
		children = endIf.children;
		if (children.length < 2)
			return token;
		last = children[children.length - 1];
		if (last.type !== ParseTreeTokenType.IF)
			return token;
		last.remove();
		conditionToken.remove();
		last.appendChild(conditionToken);
		token.appendChild(last);
		if (conditionToken.type === ParseTreeTokenType.ASSIGNMENT)
			conditionToken.type = ParseTreeTokenType.BINARY_OPERATOR;
		return last;
	}
	return token;
}

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processThen(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	prev = moveIfIfNeeded(prev);
	prev.appendChild(next);
	return addCodeBlock(prev, next);
};