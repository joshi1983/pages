import { processValidationTestCases } from './processValidationTestCases.js';
import { validateMixCalls } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateMixCalls.js';

export function testValidateMixCalls(logger) {
	const cases = [
	{'code': 'print mix 1 2 0.5', 'error': false},// mixing 2 colors
	{'code': 'print mix 1 "red 0.5', 'error': false},// mixing 2 colors
	{'code': 'print mix 1 "purple 0.5', 'error': false},// mixing 2 colors
	{'code': 'print mix "red 1 0.5', 'error': false},// mixing 2 colors
	{'code': 'print mix [0 0 0] 1 0.5', 'error': false},// mixing 2 colors
	{'code': 'print mix [0 0 0 0] 1 0.5', 'error': false},//mixing alphacolor with color
	{'code': 'print mix 1 [0 0 0] 0.5', 'error': false},// mixing 2 colors, 1 indicates a color.
	{'code': 'print mix 1 [0 0 0 0] 0.5', 'error': false},// mixing 2 colors
	{'code': 'print mix "purple 1 0.5', 'error': false},//mixing 2 colors
	{'code': 'print mix "#f70 "black 0.5', 'error': false},// mixing 2 colors
	{'code': 'print mix "#8f70 "black 0.5', 'error': false},// mixing alphacolor with color
	{'code': 'print mix "red "black 0.5', 'error': false},// mixing 2 colors
	{'code': 'print mix "purple transparent 0.5', 'error': false},// mixing color with transparent
	{'code': 'print mix "purple [0 0 0] 0.5', 'error': false},
	{'code': 'print mix "purple [0 0 0 0 0] 0.5', 'error': true},
	{'code': 'print mix [0 0 0 0 0] "purple 0.5', 'error': true},
	{'code': 'print mix [0 0 0 0 0] transparent 0.5', 'error': true},
	{'code': 'print mix [1] [0] 0.5', 'error': false},
	{'code': 'print mix [100 100 100] transparent 0.5', 'error': false},
	{'code': 'print mix [100 100 100] [0 0 0 0] 0.5', 'error': false},
	{'code': 'print mix [0 100 100 100] [0 0 0 0] 0.5', 'error': false},
	{'code': 'print mix [0 100 100 100] [0 0 0] 0.5', 'error': false},
	{'code': 'print mix [100] [] 0.5', 'error': true},
	{'code': 'print mix [100 100 100] [] 0.5', 'error': true},
	{'code': 'print mix [100 100 100] "red 0.5', 'error': false},
	{'code': 'print mix [100 100 100 100 100] [] 0.5', 'error': true},
	];
	processValidationTestCases(cases, logger, validateMixCalls);
};