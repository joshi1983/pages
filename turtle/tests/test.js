//import { bindDocumentFocusTests } from './bindDocumentFocusTests.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
/*import { testAlphaColour } from './testAlphaColour.js';
import { testArrayUtils } from './testArrayUtils.js';
import { testAssets } from './assets/testAssets.js';
import { testBinarySearch } from './testBinarySearch.js';
import { testClamp } from './testClamp.js';
import { testClampRadianAngle } from './testClampRadianAngle.js';
import { testColour } from './testColour.js';
import { testColourDirectory } from './colour/testColourDirectory.js';
import { testCommandGroups } from './command-groups/testCommandGroups.js';
import { testCommandJSONForDuplicates } from './testCommandJSONForDuplicates.js';
import { testCommands } from './testCommands.js';
import { testCommandsJSON } from './testCommandsJSON.js';
import { testCommandsJSONCallNoArgumentCommands } from './testCommandsJSONCallNoArgumentCommands.js';
import { testCommandsJSONCompositeValidation } from './testCommandsJSONCompositeValidation.js';
import { testCommandsJSONDataTypes } from './testCommandsJSONDataTypes.js';
import { testCommandsJSONDescription } from './testCommandsJSONDescription.js';
import { testCommandsJSONHyperlinks } from './testCommandsJSONHyperlinks.js';
import { testCommandsJSONLengthRangeInfo } from './testCommandsJSONLengthRangeInfo.js';
import { testCommandsJSONOrderByPrimaryName } from './testCommandsJSONOrderByPrimaryName.js';
import { testComponents } from './components/testComponents.js';
*/import { testComponents } from './components/testComponents.js';
/*import { testDeepEquality } from './testDeepEquality.js';
import { testDebugging } from './debugging/testDebugging.js';
import { testDelay } from './testDelay.js';
import { testDrawing } from './drawing/testDrawing.js';
import { testDrawingMenu } from './drawing-menu/testDrawingMenu.js';
import { testEqualWithinThreshold } from './testEqualWithinThreshold.js';
import { testExceptionToString } from './testExceptionToString.js';
import { testFile } from './file/testFile.js';
import { testFormatNumber } from './testFormatNumber.js';
import { testHelp } from './help/testHelp.js';
import { testIsCloseEnough } from './testIsCloseEnough.js';
import { testLongestCommonSubsequence } from './testLongestCommonSubsequence.js';
import { testMapUtils } from './testMapUtils.js';
import { testMaybeDecided } from './testMaybeDecided.js';
import { testOperatorsJSON } from './testOperatorsJSON.js';
import { testParsing } from './parsing/testParsing.js';
import { testPopulateTemplateUsingObject } from './testPopulateTemplateUsingObject.js';
import { testRateLimiter } from './testRateLimiter.js';
import { testSet } from './set/testSet.js';
import { testStringBuffer } from './testStringBuffer.js';
import { testStringUtils } from './testStringUtils.js';
import { testTransparent } from './testTransparent.js';
import { testUnsupportedCommandsJSON } from './testUnsupportedCommandsJSON.js';
import { testValueToString } from './testValueToString.js';
import { testValueWrapper } from './testValueWrapper.js';*/

function replaceSpecialChars(msg) {
	msg = msg.replace(/ /g, '&nbsp;');
	msg = msg.replace(/\t/g, 'TAB');
	msg = msg.replace(/\n/g, 'NEW_LINE\n');
	return msg;
}

function runTests() {
	var results = document.getElementById('test-results');
	function log(msg) {
		msg = replaceSpecialChars(msg);
		var li = document.createElement('li');
		for (let i = 1; i < arguments.length; i++) {
			msg += '<br>' + replaceSpecialChars(arguments[i]);
		}
		li.innerHTML = msg;
		results.appendChild(li);
	}

	function namedLog(prefix) {
		return prefixWrapper(prefix, log);
	}

	/*bindDocumentFocusTests(namedLog('documentFocusTests'));
	testAlphaColour(namedLog('testAlphaColour'));
	testArrayUtils(namedLog('testArrayUtils'));
	testAssets(namedLog('testAssets'));
	testBinarySearch(namedLog('testBinarySearch'));
	testClamp(namedLog('testClamp'));
	testClampRadianAngle(namedLog('testClampRadianAngle'));
	testColour(namedLog('testColour'));
	testColourDirectory(namedLog('testColourDirectory'));
	testCommandGroups(namedLog('testCommandGroups'));
	testCommandJSONForDuplicates(namedLog('testCommandJSONForDuplicates'));
	testCommands(namedLog("testCommands"));
	testCommandsJSON(namedLog("testCommandsJSON"));
	testCommandsJSONCallNoArgumentCommands(namedLog("testCommandsJSONCallNoArgumentCommands"));
	testCommandsJSONCompositeValidation(namedLog("testCommandsJSONCompositeValidation"));
	testCommandsJSONDataTypes(namedLog("testCommandsJSONDataTypes"));
	testCommandsJSONDescription(namedLog("testCommandsJSONDescription"));
	testCommandsJSONHyperlinks(namedLog("testCommandsJSONHyperlinks"));
	testCommandsJSONLengthRangeInfo(namedLog("testCommandsJSONLengthRangeInfo"));
	testCommandsJSONOrderByPrimaryName(namedLog("testCommandsJSONOrderByPrimaryName"));
	*/testComponents(namedLog("testComponents"));
	/*testDeepEquality(namedLog('testDeepEquality'));
	testDebugging(namedLog('testDebugging'));
	testDelay(namedLog('testDelay'));
	testDrawing(namedLog('testDrawing'));
	testDrawingMenu(namedLog('testDrawingMenu'));
	testEqualWithinThreshold(namedLog('testEqualWithinThreshold'));
	testExceptionToString(namedLog('testExceptionToString'));
	testFile(namedLog('testFile'));
	testFormatNumber(namedLog('testFormatNumber'));
	testHelp(namedLog('testHelp'));
	testIsCloseEnough(namedLog('testIsCloseEnough'));
	testLongestCommonSubsequence(namedLog('testLongestCommonSubsequence'));
	testMapUtils(namedLog('testMapUtils'));
	testMaybeDecided(namedLog('testMaybeDecided'));
	testOperatorsJSON(namedLog('testOperatorsJSON'));
	testParsing(namedLog('testParsing'));
	testPopulateTemplateUsingObject(namedLog('testPopulateTemplateUsingObject'));
	testRateLimiter(namedLog('testRateLimiter'));
	testSet(namedLog('testSet'));
	testStringBuffer(namedLog('testStringBuffer'));
	testStringUtils(namedLog('testStringUtils'));
	testTransparent(namedLog('testTransparent'));
	testUnsupportedCommandsJSON(namedLog('testUnsupportedCommandsJSON'));
	testValueToString(namedLog('testValueToString'));
	testValueWrapper(namedLog('testValueWrapper'));*/
	log('All synchronous tests are complete.');
}

document.addEventListener('DOMContentLoaded', runTests);

if (document.readyState === "complete" || document.readyState === "loaded")
	runTests();
