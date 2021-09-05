import { processTokens } from './processTokens.js';
import { procStartToProcedureName } from '../../procStartToProcedureName.js';

export function processProcStart(token, result, settings) {
	result.processCommentsUpToToken(token);
	const procName = settings.procedureRenameMap.get(procStartToProcedureName(token.val).toLowerCase());
	// print a procedure definition.
	result.append(`\nto ${procName}\n`);
	if (token.children.length !== 0) {
		processTokens(token.children[0].children, result, settings);
	}
	result.append('\nend\n');
};