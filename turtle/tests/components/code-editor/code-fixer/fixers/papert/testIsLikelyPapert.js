import { ArrayUtils } from '../../../../../../modules/ArrayUtils.js';
import { codeHeartTurtleScriptExamples } from
'../../../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { isLikelyPapert } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/papert/isLikelyPapert.js';
import { javascript2DCanvasExamples } from
'../../../../../helpers/parsing/javascript2DCanvasExamples.js';
import { kturtleExampleFiles } from '../../../../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from '../../../../../helpers/parsing/logo3DExamples.js';
import { papertExamples } from '../../../../../helpers/parsing/papertExamples.js';
import { povRayExamples } from '../../../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from '../../../../../helpers/parsing/processingExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from '../../../../../helpers/parsing/webLogoExamplesContent.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, codeHeartTurtleScriptExamples);
ArrayUtils.pushAll(nonExamples, javascript2DCanvasExamples);
ArrayUtils.pushAll(nonExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonExamples, logo3DExamples);
ArrayUtils.pushAll(nonExamples, povRayExamples);
ArrayUtils.pushAll(nonExamples, processingExamples);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonExamples, webLogoExamplesContent);

export function testIsLikelyPapert(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'fd 100', 'out': false},
	// Could be Papert Logo but more likely some other varient.
	// It is valid WebLogo so consider it unlikely to be Papert.

	{'in': 'setPenColor "red\ncolor [255 0 0]', 'out': false},
	// setPenColor isn't a command in Papert Logo.

	{'in': 'setFillColor "red\ncolor [255 0 0]', 'out': false},
	// setFillColor isn't a command in Papert Logo.

	{'in': 'color [255 0 0]', 'out': true},
	{'in': 'COLOR [255 0 0]', 'out': true},
	{'in': 'colour [0 0 0]', 'out': true},
	{'in': 'colour [255 0 0]', 'out': true},
	{'in': 'reset', 'out': true},
	{'in': 'RESET', 'out': true},
	{'in': ' reset', 'out': true},
	{'in': ' reset ', 'out': true},
	{'in': `to p :n :a :l
global "factors
end`, 'out': true},
// global is not used in any other Logo varient that I'm aware of.
// Python uses global in a similar way but Python is a 
// completely different programming language.
// The following function declaration in Python should clarify 
// how global is used there and check that it doesn't return true.

	{'in': `def p(n):
	global factors
	pass`, 'out': false
	}
	];
	papertExamples.forEach(function(content) {
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
	testInOutPairs(cases, isLikelyPapert, logger);
};