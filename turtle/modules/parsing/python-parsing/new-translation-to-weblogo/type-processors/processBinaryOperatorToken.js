import { areInputValuesValidForBinaryOperator } from '../../../parse-tree-analysis/areInputValuesValidForBinaryOperator.js';
import { getCommandForPythonOperator } from './helpers/getCommandForPythonOperator.js';
import { isSameOperatorInWebLogo } from './helpers/isSameOperatorInWebLogo.js';
import { processToken } from './processToken.js';
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
	if (typeof opSymbol !== 'string') {
		result.append(`; Failed to translate operator ${token.val}. Review the input code around the operator to manually translate that part to WebLogo.\n`);
		return;
	}
	if (token.children.length < 2) {
		result.append('; Some manual review needed here.\n');
		result.append('; A binary operator from Python code was parsed without the required 2 parameters.\n');
		result.append(`; Only ${token.children.length} of the 2 parameters were found indicating a problem that needs your attention to fix.\n`);
		result.append(`; This may reflect syntax errors in the source Python or a bug in WebLogo's parser and translator.\n`);
		return; // weird case but doing nothing is better than throwing an Error when there are fewer than 2 children.
	}
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
	else if (opSymbol === ':=') {
		processToken(token.children[1], result, cachedParseTree);
		result.append('; Some manual review is needed here because the automatic translation of Python\'s := operator\n');
		result.append('; will not assign a value as done in Python\n');
	}
	else {
		const commandName = getCommandForPythonOperator(opSymbol);
		if (commandName === undefined)
			result.append(`; Unable to translate binary operator: ${opSymbol}\n`);
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