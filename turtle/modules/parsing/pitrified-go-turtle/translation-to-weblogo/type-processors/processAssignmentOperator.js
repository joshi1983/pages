import { getMakeCommandFor } from './assignments/getMakeCommandFor.js';
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

export function processAssignmentOperator(token, result, settings) {
	const varName = getVariableName(token);
	if (varName === undefined)
		return;
	if (shouldBeIgnored(token.children[1], settings))
		return;
	const keyName = getKeyName(token);
	const makeCommandName = getMakeCommandFor(token, varName);
	if (['++', '--'].indexOf(token.val) !== -1 || token.val.endsWith('=')) {
		if (keyName === undefined) {
			result.append(makeCommandName + ' ');
			result.append(valueToLiteralCode(varName));
		}
		else {
			result.append('setProperty ');
			result.append(valueToLiteralCode(varName) + ' ');
			result.append(valueToLiteralCode(keyName));
		}
	}
	result.append(' ');
	if (isUnaryAssignmentOperator(token)) {
		result.append(getReadCodeFor(varName, keyName));
		if (token.val === '++')
			result.append('+');
		else
			result.append('-');

		result.append(' 1 ');
		return;
	}
	else if (['+=', '-=', '*=', '/='].indexOf(token.val) !== -1) {
		result.append(getReadCodeFor(varName, keyName));
		result.append(' ' + token.val[0] + ' ');
	}

	const children = token.children;
	if (children.length === 2)
		processToken(children[1], result, settings);
}