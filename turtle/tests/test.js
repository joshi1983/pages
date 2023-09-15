/*import { bindDocumentFocusTests } from './bindDocumentFocusTests.js';
import { testAlphaColour } from './testAlphaColour.js';
import { testArrayUtils } from './testArrayUtils.js';
import { testAssets } from './assets/testAssets.js';
import { testBinarySearch } from './testBinarySearch.js';
import { testBlobToBase64 } from './testBlobToBase64.js';
import { testClamp } from './testClamp.js';
import { testClampRadianAngle } from './testClampRadianAngle.js';
import { testColour } from './testColour.js';
import { testColourDirectory } from './colour/testColourDirectory.js';
import { testCommandGroups } from './command-groups/testCommandGroups.js';
import { testCommands } from './testCommands.js';
*/import { testCommandsJSON } from './commands-json/testCommandsJSON.js';
/*import { testComponents } from './components/testComponents.js';
import { testDebugging } from './debugging/testDebugging.js';
import { testDeepEquality } from './testDeepEquality.js';
import { testDelay } from './testDelay.js';
import { testDrawing } from './drawing/testDrawing.js';
import { testDrawingMenu } from './drawing-menu/testDrawingMenu.js';
import { testEqualWithinThreshold } from './testEqualWithinThreshold.js';
import { testExceptionToString } from './testExceptionToString.js';
import { testFetchBlob } from './testFetchBlob.js';
import { testFile } from './file/testFile.js';
import { testFormatNumber } from './testFormatNumber.js';
import { testHelp } from './help/testHelp.js';
import { testIsCloseEnough } from './testIsCloseEnough.js';
import { testIsDigit } from './testIsDigit.js';*/
import { testJavaScriptJSON } from './testJavaScriptJSON.js';
import { testLogoCodeMigrationsJSON } from './testLogoCodeMigrationsJSON.js';
/*import { testLongestCommonSubsequence } from './testLongestCommonSubsequence.js';
import { testMapUtils } from './testMapUtils.js';
import { testMaybeDecided } from './testMaybeDecided.js';
import { testOperatorsJSON } from './testOperatorsJSON.js';
import { testParsing } from './parsing/testParsing.js';
import { testPopulateTemplateUsingObject } from './testPopulateTemplateUsingObject.js';
import { testRateLimiter } from './testRateLimiter.js';
import { testSet } from './set/testSet.js';
import { testSetUtils } from './testSetUtils.js';
import { testStringBuffer } from './testStringBuffer.js';
import { testStringUtils } from './testStringUtils.js';
import { testTransparent } from './testTransparent.js';
import { testUnsupportedCommandsJSON } from './testUnsupportedCommandsJSON.js';
import { testValueToLiteralCode } from './testValueToLiteralCode.js';
import { testValueToString } from './testValueToString.js';
import { testValueWrapper } from './testValueWrapper.js';
import { testWindowsCommandsJSON } from './testWindowsCommandsJSON.js';*/
import { wrapAndCall } from './helpers/wrapAndCall.js';

function replaceSpecialChars(msg) {
	msg = msg.replace(/ /g, '&nbsp;');
	msg = msg.replace(/\t/g, 'TAB');
	msg = msg.replace(/\n/g, 'NEW_LINE\n');
	return msg;
}

const tests = [
	/*bindDocumentFocusTests,
	testAlphaColour,
	testArrayUtils,
	testAssets,
	testBinarySearch,
	testBlobToBase64,
	testClamp,
	testClampRadianAngle,
	testColour,
	testColourDirectory,
	testCommandGroups,
	testCommands,
	*/testCommandsJSON,
	/*testComponents,
	testDebugging,
	testDeepEquality,
	testDelay,
	testDrawing,
	testDrawingMenu,
	testEqualWithinThreshold,
	testExceptionToString,
	testFetchBlob,
	testFile,
	testFormatNumber,
	testHelp,
	testIsCloseEnough,
	testIsDigit,*/
	testJavaScriptJSON,
	testLogoCodeMigrationsJSON,/*
	testLongestCommonSubsequence,
	testMapUtils,
	testMaybeDecided,
	testOperatorsJSON,
	testParsing,
	testPopulateTemplateUsingObject,
	testRateLimiter,
	testSet,
	testSetUtils,
	testStringBuffer,
	testStringUtils,
	testTransparent,
	testUnsupportedCommandsJSON,
	testValueToLiteralCode,
	testValueToString,
	testValueWrapper,
	testWindowsCommandsJSON*/
];

function runTests() {
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
	wrapAndCall(tests, log);
	log('All synchronous tests are complete.');
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', runTests);
else
	runTests();