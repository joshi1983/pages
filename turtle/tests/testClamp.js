import { clamp } from '../modules/clamp.js';

export function testClamp(logger) {
	const cases = [
	{'in': [100, 0, 255], 'out': 100},
	{'in': [1000, 0, 255], 'out': 255},
	{'in': [-100, 0, 255], 'out': 0},
	{'in': [0, 0, 255], 'out': 0},
	{'in': [255, 0, 255], 'out': 255}
	];
	cases.forEach(function(caseInfo) {
		const actualResult = clamp.apply(undefined, caseInfo.in);
		if (actualResult !== caseInfo.out)
			logger('Expected clamp ' + JSON.stringify(caseInfo.in) + ' to return ' + caseInfo.out + ' but got ' + actualResult);
	});
};