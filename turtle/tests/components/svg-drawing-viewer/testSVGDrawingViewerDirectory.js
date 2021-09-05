import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testCleanBorderSize } from './testCleanBorderSize.js';
import { testSVGDrawingViewer } from './testSVGDrawingViewer.js';
import { testSVGDrawingViewerNotChangingDrawing } from './testSVGDrawingViewerNotChangingDrawing.js';
import { testSVGDrawingViewerResize } from './testSVGDrawingViewerResize.js';
import { testSVGTransformer } from './testSVGTransformer.js';

export function testSVGDrawingViewerDirectory(logger) {
	testCleanBorderSize(prefixWrapper('testCleanBorderSize', logger));
	testSVGDrawingViewer(prefixWrapper('testSVGDrawingViewer', logger));
	testSVGDrawingViewerNotChangingDrawing(prefixWrapper('testSVGDrawingViewerNotChangingDrawing', logger));
	testSVGDrawingViewerResize(prefixWrapper('testSVGDrawingViewerResize', logger));
	testSVGTransformer(prefixWrapper('testSVGTransformer', logger));
};