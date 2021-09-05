import { compareTokenLocations } from '../../../../modules/parsing/parse-tree-token/compareTokenLocations.js';
import { getInstructionListChildToken } from '../../../../modules/parsing/parse-tree-analysis/getInstructionListChildToken.js';
import { isInProcedure } from '../../../../modules/parsing/parse-tree-analysis/isInProcedure.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';

export function validateVariableAssignmentScope(scope, logger) {
	if (isInProcedure(scope.assignToken)) {
		const instructionToken = getInstructionListChildToken(scope.assignToken);
		if (instructionToken.nextSibling !== null &&
		instructionToken.nextSibling.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
		scope.fromToken.type === ParseTreeTokenType.PROCEDURE_END_TOKEN)
			logger(`fromToken should not be END since there is at least 1 command or procedure call between the assignToken and END.`);
	}
	const fromToComparison = compareTokenLocations(scope.fromToken, scope.toToken);
	if (fromToComparison > 0)
		logger(`fromToken should always be either before or at the same location as toToken.  fromToken = ${scope.fromToken}, toToken = ${scope.toToken}`);
};