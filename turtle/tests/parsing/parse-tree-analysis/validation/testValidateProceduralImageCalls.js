import { processValidationTestCase } from './processValidationTestCase.js';
import { validateProceduralImageCalls } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateProceduralImageCalls.js';

export function testValidateProceduralImageCalls(logger) {
	const cases = [
		{'code': '', 'warn': false, 'error': false},
		{'code': 'proceduralImage "p 100 100', 'error': false},
		// another validator will check if the procedure exists.

		{'code': 'to p\nend\nproceduralImage "p 100 100', 'error': false},
		// another validator will validate number of parameters to the procedure.

		{'code': 'to p :x :y\noutput "red\nend\nproceduralImage "p 100 100', 'error': false},
		// all good.  Nothing invalid. Returning a color name is fine.
		{'code': 'to p :x :y\noutput transparent\nend\nproceduralImage "p 100 100', 'error': false},
		// all good.  Nothing invalid.  Returning transparent is fine.
		{'code': 'to p :x :y\noutput "#1234\nend\nproceduralImage "p 100 100', 'error': false},
		// all good.  Nothing invalid.  Returning an alphacolor is fine.
		
		{'code': 'to p :x :y\nend\nproceduralImage "p 100 100', 'error': true},
		// p doesn't output a color so "error".
		
		{'code': 'to p :x :y\noutput "helloworld\nend\nproceduralImage "p 100 100', 'error': true},
		// not outputting a color, alphacolor, or transparent so error
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateProceduralImageCalls);
	});
};