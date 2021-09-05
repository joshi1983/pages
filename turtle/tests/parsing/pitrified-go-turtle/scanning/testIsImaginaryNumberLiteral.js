import { isImaginaryNumberLiteral } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/isImaginaryNumberLiteral.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../modules/parsing/pitrified-go-turtle/scanning/scan.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

// most test cases copied from the imaginary literals section at:
// https://go.dev/ref/spec
const valids = [
'0i',
'0123i',         // == 123i for backward-compatibility
'0o123i',      // == 0o123 * 1i == 83i
'0xabci',       // == 0xabc * 1i == 2748i
'0.i', '2.71828i', '1.e+0i', '6.67428e-11i', '1E6i', '.25i', '.12345E+5i', '0x1p-2i',
];

function testGeneral(logger) {
	const cases = valids.map(num => {
		return {
			'in': num,
			'out': true
		};
	});
	valids.forEach(num => {
		const truncated = num.substring(0, num.length - 1); // cut the 'i' off the end.
		cases.push({
			'in': truncated,
			'out': false
		});
	});
	testInOutPairs(cases, isImaginaryNumberLiteral, logger);
}

function testScanImaginaryNumberLiteral(logger) {
	valids.forEach(function(num, index) {
		const plogger = prefixWrapper(`Case ${index}, num=${num}`, logger);
		const tokens = scan(num);
		if (!(tokens instanceof Array))
			plogger(`Expected tokens to be an Array but found ${tokens}`);
		else if (tokens.length !== 1)
			plogger(`Expected tokens.length to be 1 but found ${tokens.length}`);
		else {
			const token = tokens[0];
			if (token.s !== num)
				plogger(`Expected the only token to have s=${num} but found ${token.s}`);
		}
	});
}

export function testIsImaginaryNumberLiteral(logger) {
	wrapAndCall([
		testGeneral,
		testScanImaginaryNumberLiteral
	], logger);
};