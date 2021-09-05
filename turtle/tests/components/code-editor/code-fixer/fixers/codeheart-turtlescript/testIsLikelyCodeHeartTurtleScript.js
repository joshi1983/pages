import { ArrayUtils } from '../../../../../../modules/ArrayUtils.js';
import { codeHeartTurtleScriptExamples } from
'../../../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { isLikelyCodeHeartTurtleScript } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/isLikelyCodeHeartTurtleScript.js';
import { kturtleExampleFiles } from
'../../../../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from '../../../../../helpers/parsing/logo3DExamples.js';
import { papertExamples } from '../../../../../helpers/parsing/papertExamples.js';
import { povRayExamples } from '../../../../../helpers/parsing/povRayExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from '../../../../../helpers/parsing/webLogoExamplesContent.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonExamples, logo3DExamples);
ArrayUtils.pushAll(nonExamples, papertExamples);
ArrayUtils.pushAll(nonExamples, povRayExamples);
ArrayUtils.pushAll(nonExamples, webLogoExamplesContent);

export function testIsLikelyCodeHeartTurtleScript(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'forward 90', 'out': false},
	{'in': 'forWard 90', 'out': false},
	{'in': 'backward 90', 'out': false},
	{'in': 'backWard 90', 'out': false},
	{'in': 'startFill(RED)', 'out': true},
	{'in': 'startFill ( RED )', 'out': true},
	{'in': 'forward 90 startFill(RED)', 'out': false},
	// the forward 90 is a stronger anti-signal than the startFill(RED).

	{'in': 'endFill()', 'out': true},
	{'in': 'setWidth(10)', 'out': true},
	{'in': 'ht', 'out': false},
	{'in': 'ht(', 'out': false},
	{'in': 'ht()', 'out': true},
	{'in': 'ht ( )', 'out': true},
	{'in': 'repeat(6) {}', 'out': true},
	{'in': 'repeat( 6 ) {}', 'out': true},
	{'in': 'repeat (6) {}', 'out': true},
	{'in': 'repeat(6) {fd(4)}', 'out': true},
	{'in': 'repeat (6) {fd(4)}', 'out': true}
	];
	codeHeartTurtleScriptExamples.forEach(function(tsContent, index) {
		if (tsContent.startsWith('fd(100)')&&tsContent.endsWith('rt(90)') &&
		index === 6) {
			// Skip a special example that will run fine in WebLogo.
			return;
		}

		cases.push({'in': tsContent, 'out': true});
	});
	nonExamples.forEach(function(kturtleContent) {
		cases.push({'in': kturtleContent, 'out': false});
	});
	
	testInOutPairs(cases, isLikelyCodeHeartTurtleScript, logger);
};