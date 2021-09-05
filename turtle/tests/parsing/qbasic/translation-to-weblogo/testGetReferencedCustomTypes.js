import { getReferencedCustomTypes } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/getReferencedCustomTypes.js';
import { parse } from
'../../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testGetReferencedCustomTypes(logger) {
	const cases = [
		{'code': '', 'numResults': 0},
		{'code': 'dim x as Integer', 'numResults': 0},
		{'code': 'dim x as String', 'numResults': 0},
		{'code': 'type x end type', 'numResults': 0},
		// custom type defined but not referenced/used.

		{'code': 'type x end type\ndim varName as x', 'numResults': 1},
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const result = getReferencedCustomTypes(parseResult.root);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		if (result.length !== caseInfo.numResults)
			plogger(`Expected ${caseInfo.numResults} but found ${result.length}`);
	});
};