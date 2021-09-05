import { testAnimationDownload } from './animation-download/testAnimationDownload.js';
import { testAvif } from './avif/testAvif.js';
import { testDrawingDownload } from './drawing-download/testDrawingDownload.js';
import { testFileExtensions } from './testFileExtensions.js';
import { testFileExtensionsJSON } from './testFileExtensionsJSON.js';
import { testFrameRates } from './testFrameRates.js';
import { testGradientToColour } from './testGradientToColour.js';
import { testLineSegments } from './line-segments/testLineSegments.js';
import { testMouseWheelZoomAdjuster } from './testMouseWheelZoomAdjuster.js';
import { testPDF } from './pdf/testPDF.js';
import { testPointClouds } from './point-clouds/testPointClouds.js';
import { testPostScript } from './post-script/testPostScript.js';
import { testRotatingTransformerModes } from './testRotatingTransformerModes.js';
import { testStringArtKit } from './string-art-kit/testStringArtKit.js';
import { testStyleToColour } from './testStyleToColour.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testDownload(logger) {
	wrapAndCall([
		testAnimationDownload,
		testAvif,
		testDrawingDownload,
		testFileExtensions,
		testFileExtensionsJSON,
		testFrameRates,
		testGradientToColour,
		testLineSegments,
		testMouseWheelZoomAdjuster,
		testPDF,
		testPointClouds,
		testPostScript,
		testRotatingTransformerModes,
		testStringArtKit,
		testStyleToColour,
	], logger);
};