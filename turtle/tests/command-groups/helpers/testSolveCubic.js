import { isCloseEnough } from '../../helpers/isCloseEnough.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { solveCubic } from '../../../modules/command-groups/helpers/solveCubic.js';

export function testSolveCubic(logger) {
/*
Some of these test cases were found using:
https://www.calculatorsoup.com/calculators/algebra/cubicequation.php
*/
	const cases = [
		[[1, 0, 0, 0], [0]],
		[[1, 2, 3, 4], [-1.6506291914393882]],
		[[1, 2, 3, -4], [0.77605]],
		[[-1, 2, 3, -4], [-1.56155, 1, 2.56155]],
		[[-1, -4, 3, -0.51851851851851799], 
			[ -4.66667, 0.33333, 0.33333]],
	];
	cases.forEach(function(caseInfo, index) {
		const result = solveCubic(...caseInfo[0]);
		const plogger = prefixWrapper(`Case ${index} with inputs a=${caseInfo[0][0]}, b=${caseInfo[0][1]}, c=${caseInfo[0][2]}, d=${caseInfo[0][3]}`, logger);
		if (result.length !== caseInfo[1].length)
			plogger(`Expected length to be ${caseInfo[1].length} but got ${result.length}`);
		else {
			for (let i = 0; i < result.length; i++) {
				if (!isCloseEnough(result[i], caseInfo[1][i]))
					plogger(`Expected ${caseInfo[1][i]} but got ${result[i]}`);
			}
		}
	});
};