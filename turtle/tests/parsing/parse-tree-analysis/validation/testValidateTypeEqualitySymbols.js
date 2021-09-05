import { processValidationTestCases } from './processValidationTestCases.js';
import { validateTypeEqualitySymbols } from '../../../../modules/parsing/parse-tree-analysis/validation/validateTypeEqualitySymbols.js';

export function testValidateTypeEqualitySymbols(logger) {
	const cases = [
		{'code': 'print mix 4 5 0.5', 'error': false},
		{'code': 'print mix 4.1 5.5 0.5', 'error': false},
		{'code': 'print mix [4] [5] 0.5', 'error': false},
		{'code': 'print mix [4.1] [5.5] 0.5', 'error': false},
		{'code': 'print mix 4.1 [5] 0.5', 'error': true},
		{'code': 'print mix 4.1 [5.5] 0.5', 'error': true},
		{'code': 'print mix [4.1] 5.5 0.5', 'error': true},
		{'code': 'print mix [4] 50 0.5', 'error': true},
		{'code': 'make "colors ["white "black]\nprint mix ' +
			'\n(item :num :colors)' +
			'\n(item 1 + :num :colors)' +
			'\n(:num - int :num)',
			'error': false
		},
		{'code': 'print mix screenColor transparent 0.4', 'error': false},
	];
	processValidationTestCases(cases, logger, validateTypeEqualitySymbols);
};
