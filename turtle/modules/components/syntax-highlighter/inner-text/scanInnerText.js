import { Command } from '../../../parsing/Command.js';
import { getClosestLiteral } from './getClosestLiteral.js';
import { getInnerText } from './getInnerText.js';
import { getStartPositionOfToken } from '../../../parsing/getStartPositionOfToken.js';
import { getTokenIndexes } from '../../../parsing/parseTreeToCodeWithComments.js';
import { Highlighter } from '../highlighters/Highlighter.js';
import { insertAfter } from './insertAfter.js';
import { insertPlainTextAfter } from './insertPlainTextAfter.js';
import { insertPlainTextBefore } from './insertPlainTextBefore.js';
import { isNumeric } from '../../../parsing/Numbers.js';
import { LogoScanner } from '../../../parsing/LogoScanner.js';
import { Operators } from '../../../parsing/Operators.js';
import { removeNodeAndJoinNeighbouringTextNodes } from './removeNodeAndJoinNeighbouringTextNodes.js';
import { setInnerText } from './setInnerText.js';
import { textToSpanWithClass } from './textToSpanWithClass.js';
import { TokenCharacterIterator } from '../../../parsing/TokenCharacterIterator.js';
import { valMap } from '../getCSSClassNameForParseToken.js';

function isInProcedureParameterList(index, getTokenInfoAtIndex) {
	const info = getTokenInfoAtIndex(index - 1);
	return info.className === 'procedure-name' ||
		info.className === 'procedure-parameter';
}

function tokenToClassName(token, procNameSet, index, getTokenInfoAtIndex) {
	if (valMap[token.s] !== undefined)
		return valMap[token.s];
	if (token.s.toLowerCase() === 'end' || token.s.toLowerCase() === 'to')
		return 'keyword';
	if (token.isComment())
		return 'comment';
	if (token.isStringLiteral() || token.s.startsWith("'"))
		return 'string-literal';
	if (Operators.getOperatorInfo(token.s) !== undefined)
		return 'binary-operator';
	if (isNumeric(token.s))
		return 'number-literal';
	if (['true', 'false'].indexOf(token.s.toLowerCase()) !== -1)
		return 'boolean-literal';
	if (token.isVariableReadReference()) {
		if (isInProcedureParameterList(index, getTokenInfoAtIndex)) {
			return 'procedure-parameter';
		}
		return 'variable-read';
	}
	if (Command.getCommandInfo(token.s) !== undefined || procNameSet.has(token.s.toLowerCase()))
		return 'parameterized-group';
	else if (token.isCommandName()) {
		const prevTokenInfo = getTokenInfoAtIndex(index - 1);
		if (prevTokenInfo.s.toLowerCase() === 'to')
			return 'procedure-name';
		return ''; // indicate leaf.
	}
}

function tokenToElement(token, procNameSet, index, getTokenClassAtIndex) {
	const className = tokenToClassName(token, procNameSet, index, getTokenClassAtIndex);
	if (className !== undefined) {
		if (className === '')
			return document.createTextNode(token.s);
		else
			return textToSpanWithClass(token.s, className);
	}
}

function processTextBetweenTokens(node, code, index, firstToken, secondToken) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string.  Not: ${code}`);
	if (!Number.isInteger(index))
		throw new Error(`index must be an integer.  Not: ${index}`);
	if (index < -1)
		throw new Error(`index must be at least -1 but got ${index}`);
	let text = '';
	let iterator = new TokenCharacterIterator(code);
	iterator.assignLocation(firstToken);
	iterator.index = index;
	iterator.next();
	const endLocation = getStartPositionOfToken(secondToken, code);
	while (!iterator.equalsLocation(endLocation)) {
		if (iterator.index >= code.length) 
			throw new Error(`Unable to find ending character.  index=${iterator.index}, text="${text}", endLineIndex=${endLocation[1]}, endColIndex=${endLocation[0]}, firstToken=${firstToken}, secondToken=${secondToken}`);
		const ch = iterator.getChar();
		text += ch;
		iterator.next();
	}
	if (text !== '') {
		insertPlainTextAfter(node, text);
	}
}

function processPrecedingText(node, innerText, tokenIndex, token) {
	const index = tokenIndex - token.s.length + 1;
	if (index > 0) {
		insertPlainTextBefore(node, innerText.substring(0, index));
		setInnerText(node, innerText.substring(index));
	}
}

export function scanInnerText(node, procNameSet) {
	const innerText = getInnerText(node);
	if (innerText !== '' && node.parentNode === null)
		throw new Error(`Unable to scan inner text of node that has no parent. innerText="${innerText}"`);
	if (innerText === '') {
		removeNodeAndJoinNeighbouringTextNodes(node);
		return;
	}
	if (Highlighter.isLineGroup(node)) {
		return;
	}
	const tokens = LogoScanner.scan(innerText);
	if (tokens.length > 0) {
		const literal = getClosestLiteral(node);
		if (literal !== undefined)
			node = literal;
		function getTokenInfoAtIndex(index) {
			if (index < 0)
				return {
					's': '',
					'className': ''
				}; // indicate unknown information.
			const className = tokenToClassName(tokens[index], procNameSet, index, getTokenInfoAtIndex);
			return {
				's': tokens[index].s,
				'className': className
			};
		}
		const result = tokens.map((token, index) => tokenToElement(token, procNameSet, index, getTokenInfoAtIndex));
		if (result.some(e => e === undefined))
			return; // indicate failure.
		else {
			const tokenIndexes = getTokenIndexes(tokens, innerText);
			const lastToken = tokens[tokens.length - 1];
			if (tokenIndexes.get(tokens[tokens.length - 1]) < innerText.length - 1)
				insertPlainTextAfter(node, innerText.substring(tokenIndexes.get(tokens[tokens.length - 1]) + 1));
			processPrecedingText(node, innerText, tokenIndexes.get(tokens[0]), tokens[0]);
			for (let i = result.length - 1; i >= 0; i--) {
				if (i < result.length - 1)
					processTextBetweenTokens(node, innerText, tokenIndexes.get(tokens[i]), tokens[i], tokens[i + 1]);
				const element = result[i];
				insertAfter(node, element);
			}
		}
		node.parentNode.removeChild(node);
		return result;
	}
};