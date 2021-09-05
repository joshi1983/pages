import { getAnalyzedVariables } from
'../../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/variable-data-types/variables/getAnalyzedVariables.js';
import { getIdentifierRenameMap } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/getIdentifierRenameMap.js';

export function parseRootToOptionsMock(root) {
	return {
		'variables': getAnalyzedVariables(root),
		'identifierRenameMap': getIdentifierRenameMap(root)
	};
};