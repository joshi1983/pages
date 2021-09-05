import { testAsyncCachedMap } from './testAsyncCachedMap.js';
import { testCodeEditor } from './code-editor/testCodeEditor.js';
import { testDialog } from './dialog/testDialog.js';
import { testElementResizeListener } from './testElementResizeListener.js';
import { testGetProcedureInfo } from './testGetProcedureInfo.js';
import { testGlossaryRepository } from './testGlossaryRepository.js';
import { testMessageToDivNoProcessLinks } from './testMessageToDivNoProcessLinks.js';
import { testPopStateListener } from './testPopStateListener.js';
import { testPushStates } from './testPushStates.js';
import { testSVGDrawingViewerDirectory } from './svg-drawing-viewer/testSVGDrawingViewerDirectory.js';
import { testSyntaxHighlighter } from './syntax-highlighter/testSyntaxHighlighter.js';
import { testUpdateHexColourDisplay } from './testUpdateHexColourDisplay.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testComponents(logger) {
	testAsyncCachedMap(prefixWrapper('testAsyncCachedMap', logger));
	testCodeEditor(prefixWrapper('testCodeEditor', logger));
	testDialog(prefixWrapper('testDialog', logger));
	testElementResizeListener(prefixWrapper('testElementResizeListener', logger));
	testGetProcedureInfo(prefixWrapper('testGetProcedureInfo', logger));
	testGlossaryRepository(prefixWrapper('testGlossaryRepository', logger));
	testMessageToDivNoProcessLinks(prefixWrapper('testMessageToDivNoProcessLinks', logger));
	testPopStateListener(prefixWrapper('testPopStateListener', logger));
	testPushStates(prefixWrapper('testPushStates', logger));
	testSVGDrawingViewerDirectory(prefixWrapper('testSVGDrawingViewerDirectory', logger));
	testSyntaxHighlighter(prefixWrapper('testSyntaxHighlighter', logger));
	testUpdateHexColourDisplay(prefixWrapper('testUpdateHexColourDisplay', logger));
};