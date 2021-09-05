import { dataTypes } from '../../../../modules/parsing/parse-tree-analysis/string-formats/dataTypes.js';
import { processStringFormatTestCases } from './processStringFormatTestCases.js';

export function testDataTypes(logger) {
	const cases = [
		{'s': 'number', 'error': true},
		{'s': 'num', 'error': false},
		{'s': 'num ', 'error': true},
		{'s': 'num\t', 'error': true},
		{'s': 'num\r', 'error': true},
		{'s': 'num\n', 'error': true},
		{'s': 'num|', 'error': true},
		{'s': '|num', 'error': true},
		{'s': ' num', 'error': true},
		{'s': 'int', 'error': false},
		{'s': 'string', 'error': false},
		{'s': 'list', 'error': false},
		{'s': 'list<num>', 'error': false},
		{'s': 'lists<num>', 'error': true},
	];
	processStringFormatTestCases(cases, logger, dataTypes);
};