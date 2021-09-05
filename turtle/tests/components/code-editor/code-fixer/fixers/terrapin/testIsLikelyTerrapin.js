import { ArrayUtils } from
'../../../../../../modules/ArrayUtils.js';
import { isLikelyTerrapin } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/isLikelyTerrapin.js';
import { logo3DExamples } from
'../../../../../helpers/parsing/logo3DExamples.js';
import { papertExamples } from
'../../../../../helpers/parsing/papertExamples.js';
import { qbasicExamples } from
'../../../../../helpers/parsing/basic/qbasicExamples.js';
import { terrapinExamples } from
'../../../../../helpers/parsing/terrapinExamples.js';
import { turtleSpacesExamples } from
'../../../../../helpers/parsing/turtleSpacesExamples.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(logo3DExamples, papertExamples,
qbasicExamples, turtleSpacesExamples);

export function testIsLikelyTerrapin(logger) {
	const cases = terrapinExamples.map(function(content) {
		return {
			'in': content,
			'out': true
		};
	});
	nonExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyTerrapin, logger);
}