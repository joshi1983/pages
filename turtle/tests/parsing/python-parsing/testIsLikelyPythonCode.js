import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { fetchText } from '../../../modules/fetchText.js';
import { isLikelyPythonCode, likelyContainsForInRange, likelyContainsMethodCall } from
'../../../modules/parsing/python-parsing/isLikelyPythonCode.js';
import { odinExamples } from
'../../helpers/parsing/odinExamples.js';
import { ProgressIndicator } from
'../../helpers/ProgressIndicator.js';
import { pythonTurtleExampleFiles } from
'../../helpers/parsing/pythonTurtleExampleFiles.js';
import { sleep } from '../../helpers/sleep.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';
const examples = await fetchJson('json/scriptExamples.json');
const copyrightenExamples = await fetchJson('tests/data/copyrightenScripts.json');
ArrayUtils.pushAll(examples, copyrightenExamples);
const nonExamples = [
];
ArrayUtils.pushAll(nonExamples, odinExamples);

function testLikelyContainsMethodCall(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'print animation.time', 'out': false},
	{'in': 'print (animation.time)', 'out': false},
	{'in': 'print animation.timeRatio', 'out': false},
	{'in': 'print animation.clampedTimeRatio', 'out': false},
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

async function testPythonExamplesDetectedAsLikelyPython(logger) {
	const progressIndicator = new ProgressIndicator('testPythonExamplesDetectedAsLikelyPython');
	logger.indicators.push(progressIndicator);
	for (let index = 0; index < pythonTurtleExampleFiles.length; index++) {
		const filename = pythonTurtleExampleFiles[index];
		const url = 'tests/data/python/' + filename;
		const pythonCode = await fetchText(url);
		const result = isLikelyPythonCode(pythonCode);
		if (result !== true)
			logger(`${filename} expected to be considered "likely Python" but got ${result}`);

		// delay a bit to prevent net::ERR_INSUFFICIENT_RESOURCES
		await sleep(100);
		progressIndicator.setProgressRatio(index / pythonTurtleExampleFiles.length);
		progressIndicator.setMessage(`${index} of ${pythonTurtleExampleFiles.length}`);
	}
	progressIndicator.completed();
}

async function testNoLoadableExampleDetectedAsLikelyPython(logger) {
	const progressIndicator = new ProgressIndicator('testNoLoadableExampleDetectedAsLikelyPython');
	logger.indicators.push(progressIndicator);
	for (let index = 0; index < examples.length; index++) {
		const exampleInfo = examples[index];
		const url = `logo-scripts/${exampleInfo.filename}`;
		const webLogoCode = await fetchText(url);
		const result = isLikelyPythonCode(webLogoCode);
		if (result !== false)
			logger(`${url} expected to be considered NOT "likely Python" but got ${result}`);

		// delay a bit to prevent net::ERR_INSUFFICIENT_RESOURCES
		await sleep(100);
	}
	progressIndicator.completed();
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