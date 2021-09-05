import { linePointDistance } from '../../../modules/command-groups/helpers/linePointDistance.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testLinePointDistance(logger) {
	const cases = [
		{'inArgs': [[0, 0], [1, 0], [0, 10]], 'out': 10},
		{'inArgs': [[0, 0], [1, 0], [0, 5]], 'out': 5},
		{'inArgs': [[0, 0], [2, 0], [0, 5]], 'out': 5},
		{'inArgs': [[0, 0], [0, 2], [0, 5]], 'out': 0},
		{'inArgs': [[0, 0], [0, 2], [5, 0]], 'out': 5},
		{'inArgs': [[0, 0, 0], [0, 2, 0], [5, 0, 0]], 'out': 5},
		{'inArgs': [[0, 0, 0], [0, 0, 2], [5, 0, 0]], 'out': 5},
	];
	for (let i = cases.length - 1; i >= 0; i--) {
		const caseInfo = cases[i];
		if (caseInfo.inArgs[0].length === 2) {
			const newCaseInfo = {
				'inArgs': caseInfo.inArgs.map((p) => {
					const result = [];
					result.push(...p);
					result.push(0);
					return result;
				}),
				'out': caseInfo.out
			};
			cases.push(newCaseInfo);
		}
	}
	testInOutPairs(cases, linePointDistance, logger);
};