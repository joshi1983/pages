import { formatToken } from './formatToken.js';
import { tokenToProcedure } from '../../../../parsing/parse-tree-analysis/tokenToProcedure.js';

export function formatProcedure(pToken, logger) {
	logger.clearIndentation();
	logger.blankLine();
	if (pToken.children.length < 2) {
		logger.log('to ', pToken);
		if (pToken.children.length === 1 && typeof pToken.children[0].val === 'string') {
			logger.log(pToken.children[0].val);
		}
		logger.newLine();
		logger.log('end', pToken);
		logger.blankLine();
		return;
	}
	const proc = tokenToProcedure(pToken);
	logger.log('to ' + proc.nameToken.val, pToken);
	proc.parameters.forEach(function(parameterName, index) {
		const paramToken = proc.getTokenForParameter(index);
		logger.log(':' + paramToken.val, paramToken);
	});
	logger.newLine();
	const instructionsToken = proc.getInstructionListToken();
	logger.indent();
	instructionsToken.children.forEach(function(child) {
		formatToken(child, logger);
	});
	logger.clearIndentation();
	logger.newLine();
	logger.log('end', proc.getEndToken());
	logger.blankLine();
};