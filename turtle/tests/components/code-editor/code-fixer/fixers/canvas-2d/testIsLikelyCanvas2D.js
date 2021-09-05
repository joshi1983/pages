import { ArrayUtils } from '../../../../../../modules/ArrayUtils.js';
import { codeHeartTurtleScriptExamples } from
'../../../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { isLikelyCanvas2D } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/canvas-2d/isLikelyCanvas2D.js';
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
import { webLogoExamplesContent } from './../../../../../helpers/parsing/webLogoExamplesContent.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, codeHeartTurtleScriptExamples);
ArrayUtils.pushAll(nonExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonExamples, logo3DExamples);
ArrayUtils.pushAll(nonExamples, papertExamples);
ArrayUtils.pushAll(nonExamples, povRayExamples);
ArrayUtils.pushAll(nonExamples, processingExamples);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonExamples, webLogoExamplesContent);

export function testIsLikelyCanvas2D(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'to', 'out': false},
	{'in': `; https://www.youtube.com/watch?v=hFj5-YwFCCY
to`, 'out': false},
	{'in': `make "darkColor "#780
http://www.cropcircleconnector.com/Sorensen/2001/NineSpheresTK.jpg`,
	'out': false},
	{'in': 'void setup() {}', 'out': false},
	{'in': 'void draw() {}', 'out': false},
	{'in': 'noStroke();', 'out': false},
	{'in': 'noFill();', 'out': false},
	{'in': 'int gridSize = 40;', 'out': false},
	{'in': 'int gridSize;', 'out': false},
	{'in': `cond := true

defer if cond {
	fmt.println("Hello World") // "Hello world" last
}

fmt.println("Hellope") // "Hellope" first"`, 'out': false},
	{'in': 'import "core:fmt"', 'out': false},
	{'in': `/*
	You can have any text or code here and
	have it be commented.
	/*
		NOTE: comments can be nested!
	*/
*/`, 'out': false}
	];
	javascript2DCanvasExamples.forEach(function(content) {
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
	testInOutPairs(cases, isLikelyCanvas2D, logger);
};