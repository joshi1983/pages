import { isCompleteNumberLiteral } from
'../../../../modules/parsing/kojo/scanning/isCompleteNumberLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsCompleteNumberLiteral(logger) {
	const validNumbers = [
		'1', '1.', '-1', '2', '14', '-14', '013', '-013', '0x11', '-0x11'
	];
	const cases = validNumbers.map(function(id) {
		return {
			'in': id,
			'out': true
		};
	});
	const invalidNumbers = ['.', 'a', 'e', 'x'];
	for (const n of invalidNumbers) {
		cases.push({
			'in': n,
			'out': false
		});
	}
	testInOutPairs(cases, isCompleteNumberLiteral, logger);
};