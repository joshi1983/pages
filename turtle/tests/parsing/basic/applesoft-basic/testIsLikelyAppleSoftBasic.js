import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyAppleSoftBasic } from
'../../../../modules/parsing/basic/applesoft-basic/isLikelyAppleSoftBasic.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { smallVisualBasicExamples } from
'../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { tektronix405XExamples } from
'../../../helpers/parsing/basic/tektronix405XExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { trueBasicExamples } from
'../../../helpers/parsing/basic/trueBasicExamples.js';

const nonApplesoftBasicExamples = [];
ArrayUtils.pushAll(nonApplesoftBasicExamples, bbcBasicExamples);
ArrayUtils.pushAll(nonApplesoftBasicExamples, commodoreBasicExamples);
ArrayUtils.pushAll(nonApplesoftBasicExamples, qbasicExamples);
ArrayUtils.pushAll(nonApplesoftBasicExamples, sinclairBasicExamples);
ArrayUtils.pushAll(nonApplesoftBasicExamples, smallVisualBasicExamples);
ArrayUtils.pushAll(nonApplesoftBasicExamples, tektronix405XExamples);
ArrayUtils.pushAll(nonApplesoftBasicExamples, trueBasicExamples);

export function testIsLikelyAppleSoftBasic(logger) {
	const cases = [
		{'in': 'fd 10', 'out': false},
		{'in': 'penUp', 'out': false},
		{'in': 'import turtle', 'out': false},
		{'in': 'HGR', 'out': true},
		{'in': 'HGR ', 'out': true},
		{'in': 'HGR\t', 'out': true},
		{'in': '\tHGR\t', 'out': true},
		{'in': ' HGR ', 'out': true},
		{'in': 'HGR\nprint "hi"', 'out': true},
		{'in': 'GR', 'out': true},
		{'in': '10 HGR', 'out': true},
		{'in': `REM copied from:
REM https://www.facebook.com/share/p/14JA3TuRntQ/
10 HGR
20 R=70
30 PI = 3.1415927
40 FOR I = 0 TO 24
50 A1 = 2*PI/100 * I
60 X1 = R * COS(A1)
70 Y1 = R * SIN(A1)
80 FOR J = I+1 TO 24
90 A2 = 2*PI/100 * J
100 X2 = R * COS(A2)
110 Y2 = R * SIN(A2)
120 HPLOT X1,Y1 TO X2,Y2
130 NEXT J
140 NEXT I`, 'out': true}
	];
	applesoftExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	nonApplesoftBasicExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyAppleSoftBasic, logger);
};