import { holyCExamples } from
'../../helpers/parsing/holyCExamples.js';
import { isLikelyHolyC } from
'../../../modules/parsing/holy-c/isLikelyHolyC.js';
import { logoInterpreterExamples } from
'../../helpers/parsing/logoInterpreterExamples.js';
import { terrapinExamples } from
'../../helpers/parsing/terrapinExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const nonExamples = logoInterpreterExamples.concat(terrapinExamples);

export function testIsLikelyHolyC(logger) {
	const cases = [
		{'in': `public class U8 {
	public static void main(String[] args) {
		U8 A;
		U8 B = new U8();
	}
}`, 'out': false
	// That is an example of Java.
	// Defining and using a type named U8 makes part of the code resemble HolyC code.
	}
	];
	holyCExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyHolyC, logger);
};