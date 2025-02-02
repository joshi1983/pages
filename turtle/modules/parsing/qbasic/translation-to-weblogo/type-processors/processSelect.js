import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

const processableValueTokenTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
]);

function getCodeBlockFromCase(token) {
	const children = token.children;
	for (const child of children) {
		if (child.type === ParseTreeTokenType.CODE_BLOCK)
			return child;
	}
}

function isProcessableCase(token) {
	if (token.type !== ParseTreeTokenType.CASE)
		return false;
	const children = token.children;
	if (children.length === 1)
		return false;

	return getCodeBlockFromCase(token) !== undefined;
}

function isToToken(token) {
	return token.type === ParseTreeTokenType.BINARY_OPERATOR &&
		token.val.toLowerCase() === 'to';
}

function isTranslatableConditionChild(token) {
	if (token.type === ParseTreeTokenType.COMMA)
		return false;
	if (isToToken(token) && token.children.length !== 2)
		return false;
	return true;
}

function translateCondition(selectValueToken, token, result, options) {
	const codeBlock = getCodeBlockFromCase(token);
	const children = token.children.filter(isTranslatableConditionChild);
	const codeBlockIndex = children.indexOf(codeBlock);
	let wrapInBrackets = codeBlockIndex > 2;
	if (codeBlockIndex > 1) {
		if (wrapInBrackets)
			result.append('( ');
		result.append(' or ');
	}
	for (let i = 0; i < codeBlockIndex; i++) {
		const child = children[i];
		if (isToToken(child)) {
			const leftChild = child.children[0];
			const rightChild = child.children[1];
			result.append(' and ');
			processToken(selectValueToken, result, options);
			result.append(' >= ');
			processToken(leftChild, result, options);
			result.append(' ');
			processToken(selectValueToken, result, options);
			result.append(' <= ');
			processToken(rightChild, result, options);
		}
		else {
			processToken(selectValueToken, result, options);
			result.append(' = ');
			processToken(child, result, options);
			result.append(' ');
		}
	}
	if (wrapInBrackets)
		result.append(' )');
}

function canSelectValueTokenBeProcessed(selectValueToken) {
	return processableValueTokenTypes.has(selectValueToken.type);
}

export function processSelect(token, result, options) {
	const children = token.children;
	if (children.length > 1) {
		const mainCase = children[0];
		if (mainCase === undefined || mainCase.type !== ParseTreeTokenType.CASE)
			return false;
		const selectValueToken = mainCase.children[0];
		if (!canSelectValueTokenBeProcessed(selectValueToken))
			return;
		const cases = children.filter(isProcessableCase);
		for (let i = 0; i < cases.length; i++) {
			const caseToken = cases[i];
			result.append(` if`);
			const useIfElse = i < cases.length - 1;
			if (useIfElse)
				result.append('else');
			result.append(' ');
			translateCondition(selectValueToken, caseToken, result, options);
			const codeBlock = getCodeBlockFromCase(caseToken);
			processToken(codeBlock, result, options);
			if (useIfElse)
				result.append(' [ ');
		}
		if (cases.length > 1)
			result.append(' ] '.repeat(cases.length - 1));
	}
};