import { isCloseEnough } from '../../helpers/isCloseEnough.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { solveQuartic } from '../../../modules/command-groups/helpers/solveQuartic.js';

export function testSolveQuartic(logger) {
	/*
	Some test cases were made using:
	https://keisan.casio.com/exec/system/1181809416
	*/
	const cases = [
		[[-1, 0, 0, 0, -1], []],
		[[1, 0, 0, 0, 0], [0]],
		[[1, 0, 0, 0, -1], [-1, 1]],
		[[1, -7, 5, 31, -30], [-2, 1, 3, 5]],
		[[1, -5, 5, 31, -30], [-2.1744896073063, 0.9339055365526]],
		[[-1, 6, 15, 0, -30], [1.2019178510471, 7.8490250446563]],
		[[1, 2, -5, 4, -5], [-3.7264401958498, 1.3896984523755]],
		[[2, 5, -5, 34, 6], [-4.0860699685122, -0.1714570241968]]
	];
	cases.forEach(function(caseInfo, index) {
		const result = solveQuartic(...caseInfo[0]);
		const plogger = prefixWrapper(`Case ${index} with inputs a=${caseInfo[0][0]}, b=${caseInfo[0][1]}, c=${caseInfo[0][2]}, d=${caseInfo[0][3]}, e=${caseInfo[0][4]}`, logger);
		if (result.length !== caseInfo[1].length)
			plogger(`Expected length to be ${caseInfo[1].length} but got ${result.length}.  The actual results are: ${JSON.stringify(result)}`);
		else {
			for (let i = 0; i < result.length; i++) {
				if (!isCloseEnough(result[i], caseInfo[1][i]))
					plogger(`Expected ${caseInfo[1][i]} but got ${result[i]}`);
			}
		}
	});
};