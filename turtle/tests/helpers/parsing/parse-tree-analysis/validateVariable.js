import { prefixWrapper } from '../../prefixWrapper.js';
import { validateVariableAssignmentScope } from './validateVariableAssignmentScope.js';

export function validateVariable(variable, logger) {
	logger = prefixWrapper(`Validating variable ${variable.name}`, logger);
	const applicableTokens = new Set();
	const assignTokens = new Set();
	for (let i = 0; i < variable.scopes.length; i++) {
		const scope = variable.scopes[i];
		if (assignTokens.has(scope.assignToken))
			logger(`Duplicate assignToken found for ${scope.assignToken}`);
		else
			assignTokens.add(scope.assignToken);
		for (const token of scope.applicableTokens) {
			if (applicableTokens.has(token))
				logger(`Duplicate applicable token found for token: ${token}`);
			applicableTokens.add(token);
		}
		validateVariableAssignmentScope(scope, logger);
	}
};