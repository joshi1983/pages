import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testSVGDrawingViewer } from './testSVGDrawingViewer.js';
import { testSVGDrawingViewerNotChangingDrawing } from './testSVGDrawingViewerNotChangingDrawing.js';
import { testSVGTransformer } from './testSVGTransformer.js';

export function testSVGDrawingViewerDirectory(logger) {
	testSVGDrawingViewer(prefixWrapper('testSVGDrawingViewer', logger));
	testSVGDrawingViewerNotChangingDrawing(prefixWrapper('testSVGDrawingViewerNotChangingDrawing', logger));
	testSVGTransformer(prefixWrapper('testSVGTransformer', logger));
};