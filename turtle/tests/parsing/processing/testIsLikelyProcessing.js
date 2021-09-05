import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { asmTurtleExamples } from '../../helpers/parsing/asmTurtleExamples.js';
import { codeHeartTurtleScriptExamples } from '../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { javascript2DCanvasExamples } from '../../helpers/parsing/javascript2DCanvasExamples.js';
import { kturtleExampleFiles } from '../../helpers/parsing/kturtleExampleFiles.js';
import { isLikelyProcessing } from '../../../modules/parsing/processing/isLikelyProcessing.js';
import { logo3DExamples } from '../../helpers/parsing/logo3DExamples.js';
import { processingExamples } from '../../helpers/parsing/processingExamples.js';
import { pythonTurtleExampleFilesContent } from '../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { sonicWebTurtleExamples } from
'../../helpers/parsing/sonicWebTurtleExamples.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from
'../../helpers/parsing/webLogoExamplesContent.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, asmTurtleExamples);
ArrayUtils.pushAll(nonExamples, codeHeartTurtleScriptExamples);
ArrayUtils.pushAll(nonExamples, javascript2DCanvasExamples);
ArrayUtils.pushAll(nonExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonExamples, logo3DExamples);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonExamples, sonicWebTurtleExamples);
ArrayUtils.pushAll(nonExamples, webLogoExamplesContent);

export function testIsLikelyProcessing(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'fd 100', 'out': false}, // could be WebLogo, FMSLogo or many other Logo languages
	{'in': '// Hello world', 'out': false}, // could be other languages like JavaScript
	{'in': '/* Hello world */', 'out': false}, // could be other languages like JavaScript
	{'in': '/** Hello world */', 'out': false},
	{'in': '; some WebLogo comment containing fill(1)', 'out': false},
	{'in': '; some WebLogo comment containing fill(1) and stroke(1)', 'out': false},
	{'in': `void setup() {
}`, 'out': true},
	{'in': `void draw() {
}`, 'out': true}
	];
	processingExamples.forEach(function(exampleCode) {
		cases.push({
			'in': exampleCode,
			'out': true
		});
	});
	nonExamples.forEach(function(exampleCode) {
		cases.push({
			'in': exampleCode,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyProcessing, logger);
};