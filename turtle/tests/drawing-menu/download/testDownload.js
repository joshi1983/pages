import { testAnimationDownload } from './animation-download/testAnimationDownload.js';
import { testDrawingDownload } from './drawing-download/testDrawingDownload.js';
import { testFileExtensions } from './testFileExtensions.js';
import { testFileExtensionsJSON } from './testFileExtensionsJSON.js';
import { testFrameRates } from './testFrameRates.js';
import { testGradientToColour } from './testGradientToColour.js';
import { testMouseWheelZoomAdjuster } from './testMouseWheelZoomAdjuster.js';
import { testRotatingTransformerModes } from './testRotatingTransformerModes.js';
import { testStyleToColour } from './testStyleToColour.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testDownload(logger) {
	wrapAndCall([
		testAnimationDownload,
		testDrawingDownload,
		testFileExtensions,
		testFileExtensionsJSON,
		testFrameRates,
		testGradientToColour,
		testMouseWheelZoomAdjuster,
		testRotatingTransformerModes,
		testStyleToColour,
	], logger);
};