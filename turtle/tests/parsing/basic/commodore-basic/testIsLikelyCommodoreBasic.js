import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyCommodoreBasic } from
'../../../../modules/parsing/basic/commodore-basic/isLikelyCommodoreBasic.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { tektronix405XExamples } from
'../../../helpers/parsing/basic/tektronix405XExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { trs80BasicExamples } from
'../../../helpers/parsing/basic/trs80BasicExamples.js';
import { trueBasicExamples } from
'../../../helpers/parsing/basic/trueBasicExamples.js';

const nonExamples = qbasicExamples.
	concat(applesoftExamples).
	concat(bbcBasicExamples).
	concat(sinclairBasicExamples).
	concat(tektronix405XExamples).
	concat(trs80BasicExamples).
	concat(trueBasicExamples);

export function testIsLikelyCommodoreBasic(logger) {
	const cases = [
		{'in': 'screen 2', 'out': false}, // supported by QBASIC but not Commodore BASIC
		{'in': 'screen 9', 'out': false},
		{'in': 'def fnx()=2', 'out': true},
		{'in': 'DEF FNX()=2', 'out': true},
		{'in': 'def fnx ()=2', 'out': true},
		{'in': 'def fnx(x)=2', 'out': true},
		{'in': 'DEF FNX(X)=2', 'out': true},
		{'in': 'def fnx( x )=2', 'out': true},
		{'in': 'def fnx(x)=x', 'out': true},
		{'in': 'def fnx(x,y)=x', 'out': true},
		{'in': 'def fnx(x,y)=x*2', 'out': true},
		{'in': 'def fnx(x,y)=(x*2)+3', 'out': true},
	];
	nonExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	commodoreBasicExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyCommodoreBasic, logger);
};
