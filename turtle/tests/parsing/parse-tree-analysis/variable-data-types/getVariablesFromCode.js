import { getAnalyzedVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';

export function getVariablesFromCode(code, logger) {
	const cached = getCachedParseTreeFromCode(code, logger);
	return getAnalyzedVariables(cached);
};