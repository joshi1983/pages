import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const validParentTypes = new Map([
	[ParseTreeTokenType.ELSE, [
		ParseTreeTokenType.IF,
	]],
	[ParseTreeTokenType.FOR, [
		ParseTreeTokenType.CODE_BLOCK,
	]],
	[ParseTreeTokenType.IF, [
		ParseTreeTokenType.CODE_BLOCK,
	]],
	[ParseTreeTokenType.REPEAT, [
		ParseTreeTokenType.CODE_BLOCK,
	]],
	[ParseTreeTokenType.WHILE, [
		ParseTreeTokenType.CODE_BLOCK,
	]]
]);

for (const key of validParentTypes.keys()) {
	const types = validParentTypes.get(key);
	validParentTypes.set(key, new Set(types));
}

export function isCompleteWithNext(prev, next) {
	if (prev.parentNode === null)
		return false;
	
	const prevChildren = prev.children;
	const lastChild = prevChildren[prevChildren.length - 1];
	if (prev.type === ParseTreeTokenType.IF) {
		if (prevChildren.length < 2)
			return false;
		if (lastChild.type === ParseTreeTokenType.ELSE)
			return true;

		return next.type !== ParseTreeTokenType.ELSE;
	}

	const validParentTypesForNext = validParentTypes.get(next.type);
	if (validParentTypesForNext !== undefined)
		return !validParentTypesForNext.has(prev.type);
	
	return false;
};