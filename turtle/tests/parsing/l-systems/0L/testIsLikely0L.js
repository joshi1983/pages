import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { cgjenningsExamples } from
'../../../helpers/parsing/l-systems/cgjenningsExamples.js';
import { fractintExamples } from
'../../../helpers/parsing/l-systems/fractintExamples.js';
import { isLikely0L } from
'../../../../modules/parsing/l-systems/0L/isLikely0L.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { zeroLExamples } from
'../../../helpers/parsing/l-systems/zeroLExamples.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, cgjenningsExamples);
ArrayUtils.pushAll(nonExamples, fractintExamples);

export function testIsLikely0L(logger) {
	const cases = [];
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	zeroLExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	testInOutPairs(cases, isLikely0L, logger);
};