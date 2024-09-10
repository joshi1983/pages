/*import { testAsyncCachedMap } from './testAsyncCachedMap.js';
import { testCodeEditor } from './code-editor/testCodeEditor.js';
import { testDialog } from './dialog/testDialog.js';
import { testElementResizeListener } from './testElementResizeListener.js';
import { testEventQueue } from './testEventQueue.js';
import { testGetFileFormatFromArrayBuffer } from './testGetFileFormatFromArrayBuffer.js';
import { testGetProcedureInfo } from './testGetProcedureInfo.js';
import { testGlossaryRepository } from './testGlossaryRepository.js';
import { testImageFormats } from './image-formats/testImageFormats.js';
import { testMessageToDivNoProcessLinks } from './testMessageToDivNoProcessLinks.js';
*/import { testOptionList } from './testOptionList.js';
/*import { testPopStateListener } from './testPopStateListener.js';
import { testPushStates } from './testPushStates.js';
import { testSelectionUtils } from './testSelectionUtils.js';
import { testSVGDrawingViewerDirectory } from './svg-drawing-viewer/testSVGDrawingViewerDirectory.js';
import { testSyntaxHighlighter } from './syntax-highlighter/testSyntaxHighlighter.js';
import { testUpdateHexColourDisplay } from './testUpdateHexColourDisplay.js';
import { testURLUtils } from './testURLUtils.js';
*/import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testComponents(logger) {
	wrapAndCall([
		/*testAsyncCachedMap,
		testCodeEditor,
		testDialog,
		testElementResizeListener,
		testEventQueue,
		testGetFileFormatFromArrayBuffer,
		testGetProcedureInfo,
		testGlossaryRepository,
		testImageFormats,
		testMessageToDivNoProcessLinks,
		*/testOptionList,
		/*testPopStateListener,
		testPushStates,
		testSelectionUtils,
		testSVGDrawingViewerDirectory,
		testSyntaxHighlighter,
		testUpdateHexColourDisplay,
		testURLUtils*/
	], logger);
};