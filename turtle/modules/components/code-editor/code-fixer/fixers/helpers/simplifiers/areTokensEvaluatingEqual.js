import { Command } from
'../../../../../../parsing/Command.js';
import { equalWithinThreshold } from
'../../../../../../equalWithinThreshold.js';
import { getLogarithmInTokenBase } from
'./getLogarithmInTokenBase.js';
import { getTokenValueBasic } from
'../../../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { isNumber } from
'../../../../../../isNumber.js';
import { mightHaveSideEffects } from
'../../../../../../parsing/parse-tree-analysis/mightHaveSideEffects.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';
import { constCommands } from
'./simplifyBinaryOperators.js';
import { symmetricNames } from
'./simplifySignSymmetricParameterizedGroups.js';
import { unwrapCurvedBracketExpressions } from
'./unwrapCurvedBracketExpressions.js';

function isPowerEquality(token1, token2) {
	if (token1.type !== ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const temp = token1;
		token1 = token2;
		token2 = temp;
	}
	if (token1.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;

	const info = Command.getCommandInfo(token1.val);
	if (info === undefined || info.primaryName !== 'power')
		return false;

	const children = token1.children;
	const firstChild = children[0];
	const exponentToken = children[1];
	const exponentVal = getTokenValueBasic(exponentToken);
	if (exponentVal === 1)
		return areTokensEvaluatingEqual(firstChild, token2);

	if (isNumber(exponentVal)) {
		const exponent = getLogarithmInTokenBase(token2, firstChild);
		if (exponent === exponentVal)
			return true;
	}

	return false;
}

function unwrapThroughNegativeSign(token) {
	token = unwrapCurvedBracketExpressions(token);
	while (token.type === ParseTreeTokenType.UNARY_OPERATOR &&
	token.val === '-' &&
	token.children.length === 1) {
		token = unwrapCurvedBracketExpressions(token.children[0]);
	}
	return token;
}

function areTokensEvaluatingEqualOneDirection(token1, token2) {
	if (isPowerEquality(token1, token2)) {
		return true;
	}

	if (mightHaveSideEffects(token1) ||
	mightHaveSideEffects(token2))
		return false;

	if (token1.type === ParseTreeTokenType.VARIABLE_READ) {
		if (token2.type === token1.type)
			return token1.val.toLowerCase() === token2.val.toLowerCase();
	}
	else if (token1.type === ParseTreeTokenType.NUMBER_LITERAL) {
		if (token2.type === token1.type)
			return token1.val === token2.val;
	}
	else if (token1.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info1 = Command.getCommandInfo(token1.val);
		if (info1 === undefined)
			return false;

		if (token2.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
		token2.children.length === 1 &&
		token1.children.length === 1 &&
		symmetricNames.has(info1.primaryName.toLowerCase())) {
			const info2 = Command.getCommandInfo(token2.val);
			if (info2 !== undefined && info2.primaryName === info1.primaryName) {
				const firstChild1 = unwrapThroughNegativeSign(token1.children[0]);
				const firstChild2 = unwrapThroughNegativeSign(token2.children[0]);
				if (areTokensEvaluatingEqualOneDirection(firstChild1, firstChild2))
					return true;
			}
		}

		if (token1.children.length === 1 &&
		(info1.primaryName === 'ln' ||
		info1.primaryName === 'log10')) {
			const token2Val = getTokenValueBasic(token2);
			if (token2Val === 0 || token2Val === 1) {
				const token1ChildVal = getTokenValueBasic(unwrapCurvedBracketExpressions(token1.children[0]));
				if (token2Val === 0 && token1ChildVal === 1)
					return true; // For example, (ln 1) = 0
					// Also, (log10 1) = 0
				if (token2Val === 1) {
					if (info1.primaryName === 'log10')
						return token1ChildVal === 10;
					else
						return Math.abs(token1ChildVal - Math.E) < 0.000001;
				}
			}
		}
		if (info1.primaryName === 'tan' &&
		token1.children.length === 1) {
			const angleToken = token1.children[0];
			if (token2.type === ParseTreeTokenType.BINARY_OPERATOR &&
			token2.val === '/' &&
			token2.children.length === 2) {
				const numeratorToken = unwrapCurvedBracketExpressions(token2.children[0]);
				const denominatorToken = unwrapCurvedBracketExpressions(token2.children[1]);
				if (numeratorToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
				denominatorToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
				numeratorToken.children.length === 1 &&
				denominatorToken.children.length === 1 &&
				areTokensEvaluatingEqual(numeratorToken.children[0], angleToken) &&
				areTokensEvaluatingEqual(denominatorToken.children[0], angleToken)) {
					const numeratorInfo = Command.getCommandInfo(numeratorToken.val);
					const denominatorInfo = Command.getCommandInfo(denominatorToken.val);
					if (numeratorInfo !== undefined &&
					denominatorInfo !== undefined &&
					numeratorInfo.primaryName === 'sin' &&
					denominatorInfo.primaryName === 'cos') {
						return true; // (tan :x) = (sin :x) / (cos :x)
					}
				}
			}
		}
		if (token2.type === token1.type) {
			const info2 = Command.getCommandInfo(token2.val);
			if (info2 === undefined)
				return false;

			if (info1.primaryName === 'power' && info2.primaryName === 'exp') {
				const baseVal = getTokenValueBasic(token1.children[0]);
				if (isNumber(baseVal) &&
				equalWithinThreshold(baseVal, Math.E, 0.000001) &&
				areTokensEvaluatingEqual(token1.children[1], token2.children[0])) {
					return true;
				}
			}
			if (!constCommands.has(info1.primaryName.toLowerCase()))
				return false;

			if (info2.primaryName !== info1.primaryName)
				return false;

			return true;
		}
	}
	else if (token1.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (token1.children.length !== 2 ||
		token2.children.length !== 2)
			return false;

		if (token1.val !== token2.val)
			return false;

		if (areTokensEvaluatingEqual(token1.children[0], token2.children[0]) &&
		areTokensEvaluatingEqual(token1.children[1], token2.children[1]))
			return true;
		if (token1.val === '+' || token1.val === '*') {
			if (areTokensEvaluatingEqual(token1.children[0], token2.children[1]) &&
			areTokensEvaluatingEqual(token1.children[1], token2.children[0]))
				return true;
		}
	}
	return false;
}

function areTokensEvaluatingEqualBidirectional(token1, token2) {
	return areTokensEvaluatingEqualOneDirection(token1, token2) ||
	areTokensEvaluatingEqualOneDirection(token2, token1);	
}

export function areTokensEvaluatingEqual(token1, token2) {
	token1 = unwrapCurvedBracketExpressions(token1);
	token2 = unwrapCurvedBracketExpressions(token2);
	if (areTokensEvaluatingEqualBidirectional(token1, token2))
		return true;

	return false;
};