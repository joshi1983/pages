import { isFloatingPointLiteralStart } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isFloatingPointLiteralStart.js';
import { validNumbers } from
'./testIsCompleteNumberLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsFloatingPointLiteralStart(logger) {
	const base10Examples = [
		'0', '1', '3_7.14', '3.14', '3.1_4', '3.14e', 
		'3.14E', '3.14e+', '3.14E+', '3.14e-', '3.14E-'
	];
	const hexExamples = [
		'0x', '0x.', '0X.', '0x_', '0x1', '0xf', '0XF', '0xf.',
	];
	const valids = base10Examples.concat(hexExamples);
	for (const num of validNumbers) {
		for (let i = 1; i < num.length; i++) {
			const num1 = num.substring(0, i);
			valids.push(num1);
		}
	}
	const invalids = ['a', 'e', 'p', 'x', '', '_', '_f',
	];
	const cases = valids.map(v => { return {
		'in': v,
		'out': true
	}; 
	});
	invalids.forEach(invalid => {
		cases.push({
			'in': invalid,
			'out': false
		});
	});
	testInOutPairs(cases, isFloatingPointLiteralStart, logger);
};