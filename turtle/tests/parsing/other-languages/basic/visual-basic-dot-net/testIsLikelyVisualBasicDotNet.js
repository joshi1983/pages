import { applesoftExamples } from
'../../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { atariTurboBasicXLExamples } from
'../../../../helpers/parsing/basic/atariTurboBasicXLExamples.js';
import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { cSharpExamples } from
'../../../../helpers/parsing/cSharpExamples.js';
import { isLikelyVisualBasicDotNet } from
'../../../../../modules/parsing/other-languages/basic/visual-basic-dot-net/isLikelyVisualBasicDotNet.js';
import { microAExamples } from
'../../../../helpers/parsing/basic/microAExamples.js';
import { qbasicExamples } from
'../../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { tektronix405XExamples } from
'../../../../helpers/parsing/basic/tektronix405XExamples.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { trs80BasicExamples } from
'../../../../helpers/parsing/basic/trs80BasicExamples.js';
import { trueBasicExamples } from
'../../../../helpers/parsing/basic/trueBasicExamples.js';
import { vbDotNetExamples } from
'../../../../helpers/parsing/basic/vbDotNetExamples.js';
import { vintageBasicExamples } from
'../../../../helpers/parsing/basic/vintageBasicExamples.js';

const nonExamples = ArrayUtils.combine(
applesoftExamples, atariTurboBasicXLExamples,
bbcBasicExamples, commodoreBasicExamples, cSharpExamples, microAExamples,
qbasicExamples, sinclairBasicExamples, tektronix405XExamples,
trs80BasicExamples, trueBasicExamples, vintageBasicExamples);

export function testIsLikelyVisualBasicDotNet(logger) {
	const cases = [];
	nonExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	vbDotNetExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyVisualBasicDotNet, logger);
};