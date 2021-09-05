import { isLikelySugarLabsTurtleBlocks } from
'../../../modules/parsing/sugarlabs-turtle-blocks/isLikelySugarLabsTurtleBlocks.js';
import { sugarLabsTurtleBlocksExamples } from
'../../helpers/parsing/sugarLabsTurtleBlocksExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const cases = sugarLabsTurtleBlocksExamples.map(function(code) {
	return {
		'in': code,
		'out': true
	};
});

export function testIsLikelySugarLabsTurtleBlocks(logger) {
	testInOutPairs(cases, isLikelySugarLabsTurtleBlocks, logger);
};