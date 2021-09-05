import { isLikelyTerrapin } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/isLikelyTerrapin.js';
import { qbasicExamples } from
'../../../../../helpers/parsing/basic/qbasicExamples.js';
import { terrapinExamples } from
'../../../../../helpers/parsing/terrapinExamples.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

export function testIsLikelyTerrapin(logger) {
	const cases = terrapinExamples.map(function(content) {
		return {
			'in': content,
			'out': true
		};
	});
	qbasicExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyTerrapin, logger);
}