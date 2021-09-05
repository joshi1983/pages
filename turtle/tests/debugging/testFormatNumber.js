import { formatNumber } from '../../modules/debugging/formatNumber.js';

export function testFormatNumber(logger) {
	const cases = [
		{'in': -0.00000003, 'out': '0'},
		{'in': 0.00000003, 'out': '0'},
		{'in': -0.003, 'out': '-0.003'},
		{'in': 0.003, 'out': '0.003'},
		{'in': 0.03, 'out': '0.03'},
		{'in': 0.01, 'out': '0.01'},
		{'in': 0.9, 'out': '0.9'},
		{'in': 0.3, 'out': '0.3'},
		{'in': 0.1, 'out': '0.1'},
		{'in': -1, 'out': '-1'},
		{'in': -1.5, 'out': '-1.5'},
		{'in': 1, 'out': '1'},
		{'in': 1.5, 'out': '1.5'},
		{'in': 3, 'out': '3'},
		{'in': 9, 'out': '9'},
		{'in': 10, 'out': '10'},
		{'in': 100, 'out': '100'},
		{'in': 123, 'out': '123'},
		{'in': -100, 'out': '-100'},
	];
	cases.forEach(function(caseInfo) {
		const result = formatNumber(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected formatNumber(${caseInfo.in}) to return "${caseInfo.out}" but got ${result}`);
	});
};