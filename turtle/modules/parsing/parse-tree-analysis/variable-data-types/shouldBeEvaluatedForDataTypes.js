import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { shouldBeEvaluatedAdvanced } from './shouldBeEvaluatedAdvanced.js';

export function shouldBeEvaluatedForDataTypes(cachedParseTree, variables) {
	return function(token) {
		if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			return true; // any procedure or command call can be evaluated to data types.
		}
		if (token.type === ParseTreeTokenType.VARIABLE_READ) {
			const variable = variables.getVariableByName(token.val);
			if (variable === undefined)
				return false;
			const procedure = cachedParseTree.getProcedureAtToken(token);
			const scopes = variable.getScopesAt(token, procedure);
			if (scopes.length === 1) {
				const scope = scopes[0];
				if (scope !== undefined && scope.conditionalRanges.length !== 0) {
					const conditionalRange = scope.getConditionalRangeAt(token);
					if (conditionalRange === undefined)
						return false;
				}
			}
		}
		// If a value can not be evaluated for a constant value, a data type also can't be evaluated.
		return shouldBeEvaluatedAdvanced(token);
	};
};