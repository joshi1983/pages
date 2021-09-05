import { ArrayUtils } from
'../../../../../ArrayUtils.js';
import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';

export function translateToSublist(nonBracketTokens, result, settings) {
	const colonIndex = ArrayUtils.indexOfMatch(nonBracketTokens, token => token.type === ParseTreeTokenType.COLON);
	const subscriptToken = nonBracketTokens[0].parentNode;
	const nameToken = subscriptToken.parentNode;
	const varName = nameToken.val;
	if (colonIndex === 0) {
		// For example, Go code like a[:4] or a[:]
		if (nonBracketTokens.length === 1) {
			result.append(` ( clone :${varName} ) `);
			return;
		}
		else {
			result.append(` ( sublist ${varName} 1 `);
			const endIndexToken = nonBracketTokens[1];
			const endIndexVal = evaluateToken(endIndexToken);
			if (Number.isInteger(endIndexVal))
				result.append('' + (1 + endIndexVal));
			else
				processToken(endIndexToken, result, settings);
			result.append(' ) ');
		}
	}
	else {
		// For example, Go code like a[2:4] or a[3:]
		result.append(` ( sublist ${varName} `);
		const fromIndexToken = nonBracketTokens[0];
		const fromIndexVal = evaluateToken(fromIndexToken);
		if (Number.isInteger(fromIndexVal)) {
			result.append(` ${1 + Math.max(0, fromIndexVal)} `);
		}
		else {
			processToken(fromIndexToken, result, settings);
		}
		result.append(' ');
		if (nonBracketTokens.length > 2) {
			const toIndexToken = nonBracketTokens[colonIndex + 1];
			const toIndexVal = evaluateToken(toIndexToken);
			if (Number.isInteger(toIndexVal))
				result.append(` ${1 + toIndexVal} `);
			else {
				result.append(' ( 1 + ');
				processToken(toIndexToken, result, settings);
				result.append(' ) ');
			}
		}
		else
			result.append(' 0 ');
		result.append(' ) ');
	}
};