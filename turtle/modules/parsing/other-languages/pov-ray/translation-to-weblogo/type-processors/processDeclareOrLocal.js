import { getVariableNameFromDeclareOrLocal } from './helpers/getVariableNameFromDeclareOrLocal.js';
import { getValueTokenFromDeclareOrLocal } from './helpers/getValueTokenFromDeclareOrLocal.js';
import { isFunctionDefinition } from './helpers/isFunctionDefinition.js';
import { processFunctionDefinition } from './helpers/processFunctionDefinition.js';
import { processToken } from './processToken.js';

export function processDeclareOrLocal(token, result) {
	result.processCommentsUpToToken(token);
	if (token.children.length === 1) {
		const varName = getVariableNameFromDeclareOrLocal(token);
		const valueToken = getValueTokenFromDeclareOrLocal(token);
		if (isFunctionDefinition(varName, valueToken))
			processFunctionDefinition(varName, valueToken, result);
		else {
			if (typeof varName !== 'string') {
				result.append(`\n; Failed to get variable name from #declare\n`);
			}
			else {
				result.append(`\nmake "${varName} `);
				processToken(valueToken, result);
			}
		}
	}
	else
		result.append(`; Failed to translate #declare 1 child expected but found ${token.children.length}\n`);
};