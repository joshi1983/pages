import { basicFusionExamples } from
'../../../helpers/parsing/basic/basicFusionExamples.js';
import { isLikelyBasicFusion } from
'../../../../modules/parsing/basic/basic-fusion/isLikelyBasicFusion.js';
import { playBasicExamples } from
'../../../helpers/parsing/basic/playBasicExamples.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsLikelyBasicFusion(logger) {
	const cases = playBasicExamples.concat(qbasicExamples).map(function(content) {
		return {
			'in': content,
			'out': false
		};
	});
	basicFusionExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyBasicFusion, logger);
};