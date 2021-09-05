import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testCanDrawingBeExportedToPostScript } from './testCanDrawingBeExportedToPostScript.js';
import { testPostScriptLocalStorage } from './testPostScriptLocalStorage.js';
import { testRemoveScreenColor } from './testRemoveScreenColor.js';

export function testPostScript(logger) {
	testCanDrawingBeExportedToPostScript(prefixWrapper('testCanDrawingBeExportedToPostScript', logger));
	testPostScriptLocalStorage(prefixWrapper('testPostScriptLocalStorage', logger));
	testRemoveScreenColor(prefixWrapper('testRemoveScreenColor', logger));
};