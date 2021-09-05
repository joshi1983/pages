import { getNewVariableNamesFor } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getNewVariableNamesFor.js';
import { parse } from '../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from '../../../../../../helpers/prefixWrapper.js';

export function testGetNewVariableNamesFor(logger) {
	const cases = [
		{'code': '', 'startNames': ['x', 'y'], 'newNames': ['x', 'y']},
		{'code': 'let z=3;context.make("z",30)', 'startNames': ['z'], 'newNames': ['z2']}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const newNames = getNewVariableNamesFor(caseInfo.startNames, parseResult.root);
		if (newNames.length !== caseInfo.startNames.length)
			plogger(`Expected length of ${caseInfo.startNames.length}`);
		else {
			for (let i = 0; i < caseInfo.newNames.length; i++) {
				const newName = caseInfo.newNames[i];
				if (newName !== newNames[i])
					plogger(`Expected new name for ${caseInfo.startNames[i]} to be ${newName} but got ${newNames[i]}`);
			}
		}
	});
};