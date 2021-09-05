import { testCodeEditor } from './code-editor/testCodeEditor.js';
import { testDialog } from './dialog/testDialog.js';
import { testGetProcedureInfo } from './testGetProcedureInfo.js';
import { testMessageToDivNoProcessLinks } from './testMessageToDivNoProcessLinks.js';
import { testSVGDrawingViewerDirectory } from './svg-drawing-viewer/testSVGDrawingViewerDirectory.js';
import { testSyntaxHighlighter } from './syntax-highlighter/testSyntaxHighlighter.js';
import { testUpdateHexColourDisplay } from './testUpdateHexColourDisplay.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testComponents(logger) {
	testCodeEditor(prefixWrapper('testCodeEditor', logger));
	testDialog(prefixWrapper('testDialog', logger));
	testGetProcedureInfo(prefixWrapper('testGetProcedureInfo', logger));
	testMessageToDivNoProcessLinks(prefixWrapper('testMessageToDivNoProcessLinks', logger));
	testSVGDrawingViewerDirectory(prefixWrapper('testSVGDrawingViewerDirectory', logger));
	testSyntaxHighlighter(prefixWrapper('testSyntaxHighlighter', logger));
	testUpdateHexColourDisplay(prefixWrapper('testUpdateHexColourDisplay', logger));
};