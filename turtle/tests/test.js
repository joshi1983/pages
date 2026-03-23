import { prefixWrapper } from './helpers/prefixWrapper.js';
import { ProgressIndicator } from './helpers/ProgressIndicator.js';
import { ready } from '../modules/ready.js';

const testModuleUrls = [
	/*'./bindDocumentFocusTests.js',
	'./testAlphaColour.js',
	'./testArrayUtils.js',
	'./assets/testAssets.js',
	'./testBinarySearch.js',
	'./testBlobToBase64.js',
	'./testClamp.js',
	'./testClampRadianAngle.js',
	'./testColour.js',
	'./colour/testColourDirectory.js',
	'./command-groups/testCommandGroups.js',
	'./testCommands.js',
	'./commands-json/testCommandsJSON.js',
	'./components/testComponents.js',
	'./debugging/testDebugging.js',
	'./testDeepEquality.js',
	'./testDelay.js',
	'./drawing/testDrawing.js',
	'./drawing-menu/testDrawingMenu.js',
	'./testEqualWithinThreshold.js',
	'./testExceptionToString.js',
	'./testFetchBlob.js',
	'./file/testFile.js',
	'./testFormatNumber.js',
	'./help/testHelp.js',
	'./testIsCloseEnough.js',
	'./testIsDigit.js',
	'./testJavaScriptJSON.js',
	'./testLogoCodeMigrationsJSON.js',
	'./testLongestCommonSubsequence.js',
	'./testMapUtils.js',
	'./testMaybeDecided.js',
	'./testOperatorsJSON.js',*/
	'./parsing/testParsing.js',/*
	'./testPopulateTemplateUsingObject.js',
	'./testRateLimiter.js',
	'./set/testSet.js',
	'./testSetUtils.js',
	'./testStringBuffer.js',
	'./testStringUtils.js',
	'./testTransparent.js',
	'./testUnsupportedCommandsJSON.js',
	'./testValueToLiteralCode.js',
	'./testValueToString.js',
	'./testValueWrapper.js',
	'./testWindowsCommandsJSON.js'*/
];

function replaceSpecialChars(msg) {
	msg = msg.replace(/ /g, '&nbsp;');
	msg = msg.replace(/\t/g, 'TAB');
	msg = msg.replace(/\n/g, 'NEW_LINE\n');
	return msg;
}

async function runTests() {
	const results = document.getElementById('test-results');
	const progressIndicators = document.getElementById('progress-indicators');
	function log(msg) {
		var li = document.createElement('li');
		if (typeof msg === 'string') {
			msg = replaceSpecialChars(msg);
			for (let i = 1; i < arguments.length; i++) {
				msg += '<br>' + replaceSpecialChars(arguments[i]);
			}
			li.innerHTML = msg;
		}
		else {
			li.appendChild(msg);
		}
		results.appendChild(li);
	}
	log.indicators = {
		'push': function(indicator) {
			indicator.show(progressIndicators);
		}
	};
	const progressIndicator = new ProgressIndicator('Overall Tests');
	log.indicators.push(progressIndicator);
	let i = 0;
	for (const url of testModuleUrls) {
		progressIndicator.setMessage(`Importing from ${url}`);
		const module = await import(url);
		const index = url.lastIndexOf('/');
		let key = index === -i ? url : url.substring(index + 1);
		if (key.endsWith('.js'))
			key = key.substring(0, key.length - 3);
		const testFunc = module[key];
		progressIndicator.setMessage(`Running ${key}`);
		testFunc(prefixWrapper(url, log));		
		progressIndicator.setProgressRatio(i / testModuleUrls.length);
		i++;
	}
	progressIndicator.completed();
	log('All synchronous tests are complete.');
}

ready(runTests);