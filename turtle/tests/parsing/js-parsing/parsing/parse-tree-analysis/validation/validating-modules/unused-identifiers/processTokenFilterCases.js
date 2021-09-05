import { getDescendentsOfType } from
'../../../../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { parse } from
'../../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from
'../../../../../../../helpers/prefixWrapper.js';

export function processTokenFilterCases(cases, type, isFunc, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const allIdentifiers = getDescendentsOfType(parseResult.root, type);
		const tokensMightBeReading = allIdentifiers.filter(isFunc);
		if (tokensMightBeReading.length !== caseInfo.numExpected)
			plogger(`Expected length of ${caseInfo.numExpected} but got ${tokensMightBeReading.length}`);
	});
};