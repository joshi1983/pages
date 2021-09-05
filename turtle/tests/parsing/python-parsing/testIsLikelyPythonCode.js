import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { asmTurtleExamples } from '../../helpers/parsing/asmTurtleExamples.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { fetchText } from '../../../modules/fetchText.js';
import { isLikelyPythonCode, likelyContainsForInRange, likelyContainsMethodCall } from
'../../../modules/parsing/python-parsing/isLikelyPythonCode.js';
import { javascript2DCanvasExamples } from '../../helpers/parsing/javascript2DCanvasExamples.js';
import { kturtleExampleFiles } from '../../helpers/parsing/kturtleExampleFiles.js';
import { papertExamples } from '../../helpers/parsing/papertExamples.js';
import { povRayExamples } from '../../helpers/parsing/povRayExamples.js';
import { pythonTurtleExampleFiles } from '../../helpers/parsing/pythonTurtleExampleFiles.js';
import { sonicWebTurtleExamples } from '../../helpers/parsing/sonicWebTurtleExamples.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';
const examples = await fetchJson('json/scriptExamples.json');
const copyrightenExamples = await fetchJson('tests/data/copyrightenScripts.json');
ArrayUtils.pushAll(examples, copyrightenExamples);
const nonExamples = [];
ArrayUtils.pushAll(nonExamples, asmTurtleExamples);
ArrayUtils.pushAll(nonExamples, javascript2DCanvasExamples);
ArrayUtils.pushAll(nonExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonExamples, papertExamples);
ArrayUtils.pushAll(nonExamples, povRayExamples);
ArrayUtils.pushAll(nonExamples, sonicWebTurtleExamples);

function testLikelyContainsMethodCall(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'print animation.time', 'out': false},
	{'in': 'print (animation.time)', 'out': false},
	{'in': 'penup()', 'out': false},
	{'in': '.penup(', 'out': true},
	{'in': 't.penup(', 'out': true},
	{'in': 't.penup()', 'out': true},
	];
	testInOutPairs(cases, likelyContainsMethodCall, logger);
};

function testLikelyContainsForInRange(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'print animation.time', 'out': false},
	{'in': 'for i in x:', 'out': false},
	{'in': 'for i in range(x):', 'out': true},
	{'in': 'for i in range (x):', 'out': true},
	{'in': 'for \ti \tin \trange \t(x):', 'out': true},
	{'in': 'for\ti\tin\trange\t(x):', 'out': true},
	{'in': 'for\t x\tin\trange\t(y):', 'out': true},
	];
	testInOutPairs(cases, likelyContainsForInRange, logger);
}

function testIsLikelyPythonCodeGeneralCases(logger) {
	const cases = [];
	nonExamples.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, isLikelyPythonCode, logger);
}

function testPythonExamplesDetectedAsLikelyPython(logger) {
	pythonTurtleExampleFiles.forEach(async function(filename) {
		const url = 'tests/data/python/' + filename;
		const pythonCode = await fetchText(url);
		const result = isLikelyPythonCode(pythonCode);
		if (result !== true)
			logger(`${filename} expected to be considered "likely Python" but got ${result}`);
	});
}

function testNoLoadableExampleDetectedAsLikelyPython(logger) {
	examples.forEach(async function(exampleInfo) {
		const url = `logo-scripts/${exampleInfo.filename}`;
		const webLogoCode = await fetchText(url);
		const result = isLikelyPythonCode(webLogoCode);
		if (result !== false)
			logger(`${url} expected to be considered NOT "likely Python" but got ${result}`);
	});
}

export function testIsLikelyPythonCode(logger) {
	wrapAndCall([
		testIsLikelyPythonCodeGeneralCases,
		testLikelyContainsForInRange,
		testLikelyContainsMethodCall,
		testNoLoadableExampleDetectedAsLikelyPython,
		testPythonExamplesDetectedAsLikelyPython
	], logger);
};