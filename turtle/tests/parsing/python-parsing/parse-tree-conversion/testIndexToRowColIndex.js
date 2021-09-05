import { indexToColRowIndex } from '../../../../modules/parsing/python-parsing/parse-tree-conversion/indexToColRowIndex.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testIndexToRowColIndex(logger) {
	const cases = [
		{'code': 'fd 1', 'subcases': [
			{'in': 0, 'out': {'lineIndex': 0, 'colIndex': 0}},
			{'in': 1, 'out': {'lineIndex': 0, 'colIndex': 1}}
		]},
		{'code': '\nfd 1', 'subcases': [
			{'in': 0, 'out': {'lineIndex': 0, 'colIndex': 0}},
			{'in': 1, 'out': {'lineIndex': 1, 'colIndex': 0}},
			{'in': 2, 'out': {'lineIndex': 1, 'colIndex': 1}},
			{'in': 3, 'out': {'lineIndex': 1, 'colIndex': 2}}
		]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const indexToLocation = indexToColRowIndex(caseInfo.code);
		caseInfo.subcases.forEach(function(subcaseInfo, sindex) {
			const splogger = prefixWrapper(`Subcase ${sindex}, in: ${subcaseInfo.in}`, plogger);
			const location = indexToLocation(subcaseInfo.in);
			if (location.lineIndex !== subcaseInfo.out.lineIndex)
				splogger(`Expected lineIndex to be ${subcaseInfo.out.lineIndex} but got ${location.lineIndex}`);
			if (location.colIndex !== subcaseInfo.out.colIndex)
				splogger(`Expected colIndex to be ${subcaseInfo.out.colIndex} but got ${location.colIndex}`);
		});
	});
};