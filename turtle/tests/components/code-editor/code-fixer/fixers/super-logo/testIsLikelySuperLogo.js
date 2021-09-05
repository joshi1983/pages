import { ArrayUtils } from '../../../../../../modules/ArrayUtils.js';
import { bbcBasicExamples } from
'../../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { codeHeartTurtleScriptExamples } from
'../../../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { germanLogoExamples } from
'../../../../../helpers/parsing/germanLogoExamples.js';
import { isLikelySuperLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/super-logo/isLikelySuperLogo.js';
import { javascript2DCanvasExamples } from
'../../../../../helpers/parsing/javascript2DCanvasExamples.js';
import { kturtleExamples } from '../../../../../helpers/parsing/kturtleExamples.js';
import { logo3DExamples } from '../../../../../helpers/parsing/logo3DExamples.js';
import { papertExamples } from '../../../../../helpers/parsing/papertExamples.js';
import { povRayExamples } from '../../../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from '../../../../../helpers/parsing/processingExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { superLogoExamples } from
'../../../../../helpers/parsing/superLogoExamples.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from '../../../../../helpers/parsing/webLogoExamplesContent.js';

const nonExamples = ArrayUtils.combine(bbcBasicExamples, codeHeartTurtleScriptExamples,
germanLogoExamples, javascript2DCanvasExamples, kturtleExamples, logo3DExamples, papertExamples,
povRayExamples, processingExamples, pythonTurtleExampleFilesContent, webLogoExamplesContent);

export function testIsLikelySuperLogo(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'fd 100', 'out': false},
	// Could be Super Logo but more likely some other varient.
	// It is valid WebLogo so consider it unlikely to be SuperLogo.

	];
	superLogoExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	nonExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelySuperLogo, logger);
};