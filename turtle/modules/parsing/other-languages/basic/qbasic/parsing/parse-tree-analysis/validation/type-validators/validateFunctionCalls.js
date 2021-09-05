import { functionCallToFunctionName } from '../../../functionCallToFunctionName.js';
import { functionDefinitionTypes } from '../../../functionDefinitionTypes.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from '../../../../QBasicInternalFunctions.js';

function isInFunctionDefinitionArgList(token) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const gParent = parent.parentNode;
	if (functionDefinitionTypes.has(gParent.type)) {
		return true;
	}
	return false;
}

export function validateFunctionCalls(token, parseLogger, options) {
	const children = token.children;
	if (children.length !== 2) {
		parseLogger.error(`Expected a FUNCTION_CALL to have 2 children but found ${children.length}`, token);
	}
	else {
		const name = functionCallToFunctionName(token);
		if (name === undefined)
			parseLogger.error(`Expected to get a function name for FUNCTION_CALL but unable to`, token);
		else if (!options.variables.has(name) && !isInFunctionDefinitionArgList(token)) {
			const info = QBasicInternalFunctions.getFunctionInfo(name, options.functionsMap);
			if (info === undefined)
				parseLogger.error(`No function or subroutine found with name ${name}`, token);
		}
	}
};