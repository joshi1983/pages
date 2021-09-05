import { ArrayUtils } from '../../../../ArrayUtils.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processIndex } from './helpers/processIndex.js';
import { processToken } from '../processToken.js';

function getSublistInfo(subscript) {
	const children = subscript.children;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.children.length !== 0) {
			const children2 = child.children.filter(t => t.val !== '[' && t.val !== ']');
			const index = ArrayUtils.indexOfMatch(children2, (node) => node.type === ParseTreeTokenType.COLON);
			if (index === -1)
				return;
			let fromIndexToken = null;
			let toIndexToken = null;
			if (index > 0)
				fromIndexToken = children2[index - 1];
			if (index < children2.length - 1)
				toIndexToken = children2[index + 1];
			return {
				'fromIndexToken': fromIndexToken,
				'toIndexToken': toIndexToken
			};
		}
	}
}

function processToIndex(token, buffer, cachedParseTree) {
	if (token.type === ParseTreeTokenType.NUMBER_LITERAL) {
		const val = parseFloat(token.val);
		if (!isNaN(val)) {
			buffer.append('' + (val + 1));
			return;
		}
	}
	buffer.append('1 + ');
	processToken(token, buffer, cachedParseTree);
};

export function processSubscriptExpressionToken(token, buffer, cachedParseTree) {
	const sublistInfo = getSublistInfo(token.children[1]);
	if (sublistInfo !== undefined) {
		buffer.append(' sublist ');
		processToken(token.children[0], buffer, cachedParseTree);
		buffer.append(' ');
		if (sublistInfo.fromIndexToken === null)
			buffer.append('1');
		else
			processIndex(sublistInfo.fromIndexToken, buffer, cachedParseTree);
		buffer.append(' ');
		if (sublistInfo.toIndexToken === null)
			buffer.append('0');
		else {
			processToIndex(sublistInfo.toIndexToken, buffer, cachedParseTree);
		}
	}
	else {
		buffer.append(' item ');
		const subscript = token.children[1];
		processIndex(subscript, buffer, cachedParseTree);
		processToken(token.children[0], buffer, cachedParseTree);
	}
};