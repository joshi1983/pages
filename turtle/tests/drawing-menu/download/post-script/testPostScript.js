import { testCanDrawingBeExportedToPostScript } from './testCanDrawingBeExportedToPostScript.js';
import { testPostScriptLocalStorage } from './testPostScriptLocalStorage.js';
import { testRemoveScreenColor } from './testRemoveScreenColor.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPostScript(logger) {
	wrapAndCall([
		testCanDrawingBeExportedToPostScript,
		testPostScriptLocalStorage,
		testRemoveScreenColor
	], logger);
};