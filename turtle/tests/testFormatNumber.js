import { formatNumber } from '../modules/formatNumber.js';

export function testFormatNumber(logger) {
	const cases = [
		{'in': 0, 'out': '0'},
		{'in': -1, 'out': '-1'},
		{'in': 5, 'out': '5'},
		{'in': 5.1, 'out': '5.1'},
		{'in': 5.12, 'out': '5.12'},
		{'in': 5.123, 'out': '5.12'},
		{'in': 5.126, 'out': '5.13'},
	];
	cases.forEach(function(caseInfo) {
		const result = formatNumber(caseInfo.in, 2);
		if (result !== caseInfo.out)
			logger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
};