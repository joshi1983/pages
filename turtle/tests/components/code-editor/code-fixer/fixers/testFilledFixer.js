import { filledFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/filledFixer.js';
import { processTestCase } from './processTestCase.js';

export function testFilledFixer(logger) {
	const cases = [
		{'code': '', 'to': '', 'logged': false},
		{'code': 'print 5', 'to': 'print 5', 'logged': false},
		{'code': 'filled 5 [forward 100 right 90 forward 50]', 
			'to': ' setFillColor 5 polyStart forward 100 right 90 forward 50 polyEnd', 
			'logged': true
		},
		{'code': 'filled "5 [forward 100 right 90 forward 50]', 
			'to': ' setFillColor 5 polyStart forward 100 right 90 forward 50 polyEnd', 
			'logged': true
		},
		{'code': 'fd 100 filled "5 [forward 100 right 90 forward 50]', 
			'to': 'fd 100  setFillColor 5 polyStart forward 100 right 90 forward 50 polyEnd', 
			'logged': true
		},
		{'code': 'filled "5 [forward 100 right 90 forward 50] fd 200', 
			'to': ' setFillColor 5 polyStart forward 100 right 90 forward 50 polyEnd fd 200', 
			'logged': true
		},
		{'code': 'fd 100 filled "5 [forward 100 right 90 forward 50] fd 200', 
			'to': 'fd 100  setFillColor 5 polyStart forward 100 right 90 forward 50 polyEnd fd 200', 
			'logged': true
		},
		{'code': 'filled "red [forward 100 right 90 forward 50]', 
			'to': ' setFillColor "red polyStart forward 100 right 90 forward 50 polyEnd', 
			'logged': true
		},
		{'code': 'filled random 15 [forward 100 right 90 forward 50]', 
			'to': ' setFillColor random 15 polyStart forward 100 right 90 forward 50 polyEnd', 
			'logged': true
		},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, filledFixer, logger);
	});
};