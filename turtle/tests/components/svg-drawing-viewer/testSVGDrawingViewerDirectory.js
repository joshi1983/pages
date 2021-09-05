import { testCleanBorderSize } from './testCleanBorderSize.js';
import { testSVGDrawingViewer } from './testSVGDrawingViewer.js';
import { testSVGDrawingViewerNotChangingDrawing } from './testSVGDrawingViewerNotChangingDrawing.js';
import { testSVGDrawingViewerResize } from './testSVGDrawingViewerResize.js';
import { testSVGTransformer } from './testSVGTransformer.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testSVGDrawingViewerDirectory(logger) {
	wrapAndCall([
		testCleanBorderSize,
		testSVGDrawingViewer,
		testSVGDrawingViewerNotChangingDrawing,
		testSVGDrawingViewerResize,
		testSVGTransformer
	], logger);
};