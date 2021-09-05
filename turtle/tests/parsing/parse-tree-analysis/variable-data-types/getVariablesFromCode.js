import { getAnalyzedVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { validateVariables } from '../../../helpers/parsing/parse-tree-analysis/validateVariables.js';

export function getVariablesFromCode(code, logger) {
	const cached = getCachedParseTreeFromCode(code, logger);
	const result = getAnalyzedVariables(cached);
	validateVariables(result, logger);
	return result;
};