import { areInputValuesValidForBinaryOperator } from '../../../parse-tree-analysis/areInputValuesValidForBinaryOperator.js';
import { getCommandForPythonOperator } from './helpers/getCommandForPythonOperator.js';
import { isSameOperatorInWebLogo } from './helpers/isSameOperatorInWebLogo.js';
import { processToken } from '../processToken.js';
import { pythonOperatorToWebLogoOperator } from './helpers/pythonOperatorToWebLogoOperator.js';
import { valueToWebLogoExpression } from './helpers/valueToWebLogoExpression.js';

function shouldValueBeSubstituted(webLogoSymbol, token, cachedParseTree) {
	if (webLogoSymbol === '!=')
		webLogoSymbol = '<>';
	else if (webLogoSymbol === '==')
		webLogoSymbol = '=';
	const tokenValues = cachedParseTree.getTokenValues();
	const val1 = tokenValues.get(token.children[0]);
	const val2 = tokenValues.get(token.children[1]);
	const result = tokenValues.get(token);
	if (val1 === undefined || val2 === undefined || result === undefined)
		return false;
	if (!isSameOperatorInWebLogo(webLogoSymbol))
		return false;
	return !areInputValuesValidForBinaryOperator(webLogoSymbol, val1, val2);
}

export function processBinaryOperatorToken(token, result, cachedParseTree) {
	const opSymbol = pythonOperatorToWebLogoOperator(token.val);
	if (typeof opSymbol !== 'string')
		throw new Error(`Expected operator symbol to be a string but got ${opSymbol}`);
	if (token.children.length !== 2)
		throw new Error(`binary operator tokens expected to have 2 children but found ${token.children.length}. Python operator symbol=${token.val}`);
	const leftSide = token.children[0];
	const rightSide = token.children[1];
	if (shouldValueBeSubstituted(opSymbol, token, cachedParseTree)) {
		const resultVal = cachedParseTree.getTokenValues().get(token);
		result.append(` ${valueToWebLogoExpression(resultVal)} `);
	}
	else if (isSameOperatorInWebLogo(opSymbol) || opSymbol === '<>' || opSymbol === '=') {
		processToken(leftSide, result, cachedParseTree);
		result.append(` ${opSymbol} `);
		processToken(rightSide, result, cachedParseTree);
	}
	else {
		const commandName = getCommandForPythonOperator(opSymbol);
		if (commandName === undefined)
			throw new Error(`Unable to translate binary operator: ${opSymbol}`);
		else {
			if (opSymbol === 'not in')
				result.append('not ');
			result.append(`(${commandName} `);
			processToken(token.children[0], result, cachedParseTree);
			result.append(' ');
			processToken(token.children[1], result, cachedParseTree);
			result.append(')');
		}
	}
};