import { evaluateToken } from '../../evaluation/evaluateToken.js';
import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { getMakeCommandFor } from './assignments/getMakeCommandFor.js';
import { isPossibleData } from '../../parsing/isPossibleData.js';
import { MigrationInfo } from '../../MigrationInfo.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { valueToLiteralCode } from '../../../../valueToLiteralCode.js';

function declarationToVariableToken(token) {
	let tok = token.children[0];
	if (tok === undefined) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.IDENTIFIER &&
		token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
		(token.val === '++' || token.val === '--'))
			return parent;
		return;
	}
	if (token.val === '++' || token.val === '--') {
		tok = token.parentNode;
		let parent = tok.parentNode;
		if (parent !== null && parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
		parent.children.indexOf(tok) === 1)
			tok = parent.children[0];
	}
	else if (tok.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY) {
		tok = tok.children[0];
		if (tok.type === ParseTreeTokenType.IDENTIFIER)
			return tok;
	}
	return tok;
}

function getVariableName(token) {
	const tok = declarationToVariableToken(token);
	if (tok === undefined)
		return;
	if (tok.type === ParseTreeTokenType.IDENTIFIER)
		return tok.val;
}

function getKeyName(token) {
	const tok = declarationToVariableToken(token);
	if (tok !== undefined && tok.type === ParseTreeTokenType.IDENTIFIER) {
		const parent = tok.parentNode;
		if (parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
		parent.children.indexOf(tok) === 0) {
			const propertyToken = parent.children[2];
			if (propertyToken !== undefined && propertyToken.type === ParseTreeTokenType.IDENTIFIER)
				return propertyToken.val;
		}
	}
}

function getSubscriptIndexToken(token) {
	let firstChild = token.children[0];
	if (firstChild === undefined) {
		// for example with code like a[0]++.  
		// token would represent ++ and [0] would be represented by previous sibling.
		firstChild = token.getPreviousSibling();
		if (firstChild === null)
			return;
	}
	else
		firstChild = firstChild.children[0];
	if (firstChild === undefined || firstChild.type !== ParseTreeTokenType.ARRAY_SUBSCRIPT)
		return;
	const childValueTokens = filterBracketsAndCommas(firstChild.children);
	if (childValueTokens.length === 1) {
		const indexToken = childValueTokens[0];
		if (!isPossibleData(indexToken))
			return;

		return indexToken;
	}
}

function shouldBeIgnored(rightOperand, settings) {
	if (rightOperand !== undefined &&
	rightOperand.type === ParseTreeTokenType.FUNC_CALL) {
		const info = MigrationInfo.getFunctionInfo(rightOperand, settings);
		if (info !== undefined && info.removeInMigration)
			return true;
	}
	return false;
}

function isUnaryAssignmentOperator(token) {
	const val = token.val;
	return val === '++' || val === '--';
}

function getReadCodeFor(varName, keyName) {
	if (keyName === undefined) {
		return ' :' + varName + ' ';
	} else {
		return ' ( getProperty "' + varName + ' "' + keyName + ' ) ';
	}
}

function shouldReadPreviousValue(token) {
	if ([':=', '=', '<-'].indexOf(token.val) !== -1)
		return false;
	else
		return true;
}

export function processAssignmentOperator(token, result, settings) {
	const varName = getVariableName(token);
	if (varName === undefined)
		return;
	if (shouldBeIgnored(token.children[1], settings))
		return;
	const keyName = getKeyName(token);
	const makeCommandName = getMakeCommandFor(token, varName);
	const subscriptIndexToken = getSubscriptIndexToken(token);

	if (keyName === undefined) {
		if (subscriptIndexToken !== undefined) {
			result.append('\nsetItem ');
			const indexVal = evaluateToken(subscriptIndexToken);
			if (Number.isInteger(indexVal))
				result.append('' + (1 + indexVal));
			else {
				result.append('(1 + ');
				processToken(subscriptIndexToken, result, settings);
				result.append(' ) ');
			}
		}
		else {
			result.append(makeCommandName);
		}
		result.append(` ${valueToLiteralCode(varName)}`);
	}
	else {
		result.append('setProperty ');
		result.append(valueToLiteralCode(varName) + ' ');
		result.append(valueToLiteralCode(keyName));
	}
	result.append(' ');
	if (shouldReadPreviousValue(token)) {
		if (subscriptIndexToken !== undefined) {
			const val = evaluateToken(subscriptIndexToken);
			if (val === 0)
				result.append(`(first :${varName})`);
			else {
				result.append('( item ');
				if (Number.isInteger(val))
					result.append('' + (1 + val));
				else {
					result.append(' (1 + ');
					processToken(subscriptIndexToken, result, settings);
					result.append(' ) ');
				}
				result.append(`:${varName})`);
			}
		}
		else
			result.append(getReadCodeFor(varName, keyName));
	}
	if (isUnaryAssignmentOperator(token)) {
		if (token.val === '++')
			result.append('+');
		else
			result.append('-');

		result.append(' 1 ');
		return;
	}
	else if (['+=', '-=', '*=', '/='].indexOf(token.val) !== -1) {
		result.append(' ' + token.val[0] + ' ');
	}

	const children = token.children;
	if (children.length === 2)
		processToken(children[1], result, settings);
}