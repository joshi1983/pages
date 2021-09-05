import { forTokenToCodeBlock } from './forTokenToCodeBlock.js';
import { forTokenToInitialValue } from './forTokenToInitialValue.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { forToStepValue } from './forToStepValue.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function isReadingVariable(token, variableName) {
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.children.length === 0) {
		return true;
	}
	if (token.type === ParseTreeTokenType.FOR) {
		const initVariableName = forTokenToInitVariableName(token);
		if (initVariableName === variableName)
			return false;
	}
	for (const child of token.children) {
		if (isReadingVariable(child, variableName))
			return true;
	}
	return false;
}


export function forTokenCodeBlockContainsVariableReadUntranslatableToRepcount(forToken) {
	const codeBlock = forTokenToCodeBlock(forToken);
	if (codeBlock === null)
		return false;

	const initVal = forTokenToInitialValue(forToken);
	const stepVal = forToStepValue(forToken);

	// if initial value or step don't match what WebLogo's repcount would return...
	if (initVal !== 1 || stepVal !== 1) {
		const variableName = forTokenToInitVariableName(forToken);
		if (isReadingVariable(codeBlock, variableName)) {
			// too difficult to translate the variable references to repcount when repcount is always 1,2,.. a larger number.
			return true;
		}
	}
	return false;
};