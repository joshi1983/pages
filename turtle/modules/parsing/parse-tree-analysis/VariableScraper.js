import { getProcedureStartToken } from './getProcedureStartToken.js';
import { tokenToProcedure } from './tokenToProcedure.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function getVariableName(makeToken) {
	return makeToken.children[0].val.toLowerCase();
}

function getCommandCallsWithStringLiteral(allTokens, commandName) {
	return allTokens.filter(function(token) {
		if (token.type === ParseTreeTokenType.LEAF &&
			token.val.toLowerCase() === commandName &&
			token.nextSibling !== null &&
			token.nextSibling.type === ParseTreeTokenType.STRING_LITERAL)
			return true;
		if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
			token.val.toLowerCase() === commandName &&
			token.children.length > 0 &&
			token.children[0].type === ParseTreeTokenType.STRING_LITERAL)
			return true;
		return false;
	});
}

class PrivateVariableScraper {
	getGlobalVariableNamesMade(allTokens) {
		// look for make statements with string literals as first parameter.
		const makeCallTokens = getCommandCallsWithStringLiteral(allTokens, 'make');
		const makeCallsOutsideProcedureUsingSameParameterName = makeCallTokens.filter(function(makeToken) {
			const startToken = getProcedureStartToken(makeToken);
			if (startToken === undefined)
				return true;
			else {
				const procedure = tokenToProcedure(startToken);
				if (procedure.parameters.indexOf(getVariableName(makeToken)) !== -1)
					return false;
			}
			return true;
		});
		const names = new Set();
		makeCallsOutsideProcedureUsingSameParameterName.forEach(function(makeToken) {
			names.add(getVariableName(makeToken));
		});
		return names;
	}
}

const VariableScraper = new PrivateVariableScraper();

export { VariableScraper };