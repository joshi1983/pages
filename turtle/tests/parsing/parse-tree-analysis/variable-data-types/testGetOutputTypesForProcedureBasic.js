import { DataTypes } from
'../../../../modules/parsing/data-types/DataTypes.js';
import { evaluateTokensBasic } from
'../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getOutputTypesForProcedureBasic } from
'../../../../modules/parsing/parse-tree-analysis/variable-data-types/getOutputTypesForProcedureBasic.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testGetOutputTypesForProcedureBasic(logger) {
	const cases = [
	{
		'code': 'to p output 3 end',
		'types': 'int'
	},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const procedure = cachedParseTree.getProceduresMap().get('p');
		if (procedure === undefined) {
			plogger(`Expected to find a procedure named p but did not.`);
			return;
		}
		const tokenValues = evaluateTokensBasic(cachedParseTree);
		const tokenToTypes = new Map();
		const extraInfo = new Map();
		for (const [key, value] of tokenValues) {
			tokenToTypes.set(key, DataTypes.getTypesCompatibleWithValue(value, extraInfo));
		}
		const returnTypes = getOutputTypesForProcedureBasic(procedure, tokenToTypes);
		const returnTypesStr = DataTypes.stringify(returnTypes);
		if (returnTypesStr !== caseInfo.types)
			plogger(`Expected result of ${caseInfo.types} but found ${returnTypesStr}`);
	});
};