import { bindDocumentFocusTests } from './bindDocumentFocusTests.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
import { testAssets } from './assets/testAssets.js';
import { testBinarySearch } from './testBinarySearch.js';
import { testClamp } from './testClamp.js';
import { testClampRadianAngle } from './testClampRadianAngle.js';
import { testColour } from './testColour.js';
import { testCommandJSONForDuplicates } from './testCommandJSONForDuplicates.js';
import { testCommands } from './testCommands.js';
import { testCommandsJSON } from './testCommandsJSON.js';
import { testCommandsJSONCallNoArgumentCommands } from './testCommandsJSONCallNoArgumentCommands.js';
import { testCommandsJSONDataTypes } from './testCommandsJSONDataTypes.js';
import { testCommandsJSONHyperlinks } from './testCommandsJSONHyperlinks.js';
import { testCommandGroups } from './command-groups/testCommandGroups.js';
import { testComponents } from './components/testComponents.js';
import { testDeepEquality } from './testDeepEquality.js';
import { testDebugging } from './debugging/testDebugging.js';
import { testDelay } from './testDelay.js';
import { testDrawing } from './drawing/testDrawing.js';
import { testDrawingMenu } from './drawing-menu/testDrawingMenu.js';
import { testExceptionToString } from './testExceptionToString.js';
import { testFile } from './file/testFile.js';
import { testFormatNumber } from './testFormatNumber.js';
import { testHelp } from './help/testHelp.js';
import { testIsCloseEnough } from './testIsCloseEnough.js';
import { testMaybeDecided } from './testMaybeDecided.js';
import { testOperatorsJSON } from './testOperatorsJSON.js';
import { testParsing } from './parsing/testParsing.js';
import { testPopulateTemplateUsingObject } from './testPopulateTemplateUsingObject.js';
import { testRateLimiter } from './testRateLimiter.js';
import { testSet } from './set/testSet.js';
import { testStringBuffer } from './testStringBuffer.js';
import { testTransparent } from './testTransparent.js';
import { testUnsupportedCommandsJSON } from './testUnsupportedCommandsJSON.js';
import { testValueToString } from './testValueToString.js';
import { testValueWrapper } from './testValueWrapper.js';

function runTests() {
	var results = document.getElementById('test-results');
	function log(msg) {
		msg = msg.replace(/ /g, '&nbsp;');
		msg = msg.replace(/\t/g, 'TAB');
		msg = msg.replace(/\n/g, 'NEW_LINE\n');
		var li = document.createElement('li');
		li.innerHTML = msg;
		results.appendChild(li);
	}

	function namedLog(prefix) {
		return prefixWrapper(prefix, log);
	}

	bindDocumentFocusTests(namedLog('documentFocusTests'));
	testAssets(namedLog('testAssets'));
	testBinarySearch(namedLog('testBinarySearch'));
	testClamp(namedLog('testClamp'));
	testClampRadianAngle(namedLog('testClampRadianAngle'));
	testColour(namedLog('testColour'));
	testCommandGroups(namedLog('testCommandGroups'));
	testCommandJSONForDuplicates(namedLog('testCommandJSONForDuplicates'));
	testCommands(namedLog("testCommands"));
	testCommandsJSON(namedLog("testCommandsJSON"));
	testCommandsJSONCallNoArgumentCommands(namedLog("testCommandsJSONCallNoArgumentCommands"));
	testCommandsJSONDataTypes(namedLog("testCommandsJSONDataTypes"));
	testCommandsJSONHyperlinks(namedLog("testCommandsJSONHyperlinks"));
	testComponents(namedLog("testComponents"));
	testDeepEquality(namedLog('testDeepEquality'));
	testDebugging(namedLog('testDebugging'));
	testDelay(namedLog('testDelay'));
	testDrawing(namedLog('testDrawing'));
	testDrawingMenu(namedLog('testDrawingMenu'));
	testExceptionToString(namedLog('testExceptionToString'));
	testFile(namedLog('testFile'));
	testFormatNumber(namedLog('testFormatNumber'));
	testHelp(namedLog('testHelp'));
	testIsCloseEnough(namedLog('testIsCloseEnough'));
	testMaybeDecided(namedLog('testMaybeDecided'));
	testOperatorsJSON(namedLog('testOperatorsJSON'));
	testParsing(namedLog('testParsing'));
	testPopulateTemplateUsingObject(namedLog('testPopulateTemplateUsingObject'));
	testRateLimiter(namedLog('testRateLimiter'));
	testSet(namedLog('testSet'));
	testStringBuffer(namedLog('testStringBuffer'));
	testTransparent(namedLog('testTransparent'));
	testUnsupportedCommandsJSON(namedLog('testUnsupportedCommandsJSON'));
	testValueToString(namedLog('testValueToString'));
	testValueWrapper(namedLog('testValueWrapper'));	
	log('All synchronous tests are complete.');

}

document.addEventListener('DOMContentLoaded', runTests);

if (document.readyState === "complete" || document.readyState === "loaded")
	runTests();
