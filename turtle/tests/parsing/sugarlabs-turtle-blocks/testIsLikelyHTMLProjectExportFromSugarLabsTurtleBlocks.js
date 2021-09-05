import { isLikelyHTMLProjectExportFromSugarLabsTurtleBlocks } from
'../../../modules/parsing/sugarlabs-turtle-blocks/isLikelyHTMLProjectExportFromSugarLabsTurtleBlocks.js';
import { sugarLabsTurtleBlocksExamples } from
'../../helpers/parsing/sugarLabsTurtleBlocksExamples.js';
import { sugarLabsTurtleBlocksHTMLExamples } from
'../../helpers/parsing/sugarLabsTurtleBlocksHTMLExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const cases = sugarLabsTurtleBlocksHTMLExamples.map(function(code) {
	return {
		'in': code,
		'out': true
	};
});
sugarLabsTurtleBlocksExamples.forEach(function(code) {
	cases.push({
		'in': code,
		'out': false
	});
});

export function testIsLikelyHTMLProjectExportFromSugarLabsTurtleBlocks(logger) {
	testInOutPairs(cases, isLikelyHTMLProjectExportFromSugarLabsTurtleBlocks, logger);
};