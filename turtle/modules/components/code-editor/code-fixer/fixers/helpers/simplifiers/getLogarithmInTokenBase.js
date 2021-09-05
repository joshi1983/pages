import { areTokensEvaluatingEqual } from
'./areTokensEvaluatingEqual.js';
import { Command } from
'../../../../../../parsing/Command.js';
import { getTokenValueBasic } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { isNumber } from
'../../../../../../isNumber.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';
import { unwrapCurvedBracketExpressions } from
'./unwrapCurvedBracketExpressions.js';

function isSinOfToken(token, angleToken) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
	token.children.length !== 1)
		return false;

	const info = Command.getCommandInfo(token.val);
	return info !== undefined && info.primaryName === 'sin' &&
		areTokensEvaluatingEqual(token.children[0], angleToken);
}

function isCosOfToken(token, angleToken) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
	token.children.length !== 1)
		return false;

	const info = Command.getCommandInfo(token.val);
	return info !== undefined && info.primaryName === 'cos' &&
		areTokensEvaluatingEqual(token.children[0], angleToken);
}

function getLogarithmInTokenBaseOneDirection(token, baseToken) {
	token = unwrapCurvedBracketExpressions(token);
	baseToken = unwrapCurvedBracketExpressions(baseToken);
	const baseVal = getTokenValueBasic(baseToken);
	const tokenVal = getTokenValueBasic(token);
	if (isNumber(baseVal) && isNumber(tokenVal))
		return Math.log(tokenVal) / Math.log(baseVal);
	if (tokenVal === 1)
		return 0; // (power :x 0) = 1 so return 0.

	if (areTokensEvaluatingEqual(token, baseToken))
		return 1; // (power :x 1) = :x so return 1.
	
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	token.children.length === 2) {
		if (token.val === '*') {
			let sum = 0;
			for (const child of token.children) {
				const additional = getLogarithmInTokenBase(child, baseToken);
				if (!isNumber(additional))
					return;
				sum += additional;
			}
			return sum;
		}
		else if (token.val === '/') {
			if (baseToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
			baseToken.children.length === 1) {
				const baseTokenChild = baseToken.children[0];
				const info = Command.getCommandInfo(baseToken.val);
				if (info !== undefined &&
				info.primaryName === 'tan') {
					if (isSinOfToken(unwrapCurvedBracketExpressions(token.children[1]), baseTokenChild) &&
					isCosOfToken(unwrapCurvedBracketExpressions(token.children[0]), baseTokenChild))
						return -1;
				}
			}
			
			// getLogarithmInTokenBase(:y / :z, :x) = getLogarithmInTokenBase(:y, :x) - getLogarithmInTokenBase(:z, :x).
			const leftLog = getLogarithmInTokenBase(token.children[0], baseToken);
			if (!isNumber(leftLog))
				return;

			const rightLog = getLogarithmInTokenBase(token.children[1], baseToken);
			if (!isNumber(rightLog))
				return;

			return leftLog - rightLog;
		}
	}
	else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info === undefined)
			return;

		if (info.primaryName === 'exp') {
			if (!isNumber(baseVal))
				return;

			const expChild = token.children[0];
			const expChildVal = getTokenValueBasic(expChild);
			if (!isNumber(expChildVal) || expChildVal <= 0)
				return;

			// getLogarithmInTokenBase(power E :y, :x) = :y / ln :x.
			return expChildVal / Math.log(baseVal);
		}
		else if (info.primaryName === 'power') {
			const powerBaseLog = getLogarithmInTokenBase(token.children[0], baseToken);
			const expVal = getTokenValueBasic(token.children[1]);
			if (isNumber(powerBaseLog) && isNumber(expVal)) {
				// getLogarithmInTokenBase(power :x :y, :x) = :y.
				return powerBaseLog * expVal;
			}
		}
		else if (info.primaryName === 'sqrt') {
			const firstChild = token.children[0];
			const firstChildLog = getLogarithmInTokenBase(firstChild, baseToken);
			if (isNumber(firstChildLog))
				return firstChildLog / 2;
			return;
		}
	}
}

export function getLogarithmInTokenBase(token, baseToken) {
	let result = getLogarithmInTokenBaseOneDirection(token, baseToken);
	if (isNumber(result))
		return result;
	result = getLogarithmInTokenBaseOneDirection(baseToken, token);
	if (isNumber(result) && result !== 0)
		return 1 / result;
};