import { testAnimationDownload } from './animation-download/testAnimationDownload.js';
import { testDrawingDownload } from './drawing-download/testDrawingDownload.js';
import { testFileExtensions } from './testFileExtensions.js';
import { testFileExtensionsJSON } from './testFileExtensionsJSON.js';
import { testFrameRates } from './testFrameRates.js';
import { testPDF } from './pdf/testPDF.js';
import { testPointClouds } from './point-clouds/testPointClouds.js';
import { testPostScript } from './post-script/testPostScript.js';
import { testStringArtKit } from './string-art-kit/testStringArtKit.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testDownload(logger) {
	wrapAndCall([
		testAnimationDownload,
		testDrawingDownload,
		testFileExtensions,
		testFileExtensionsJSON,
		testFrameRates,
		testPDF,
		testPointClouds,
		testPostScript,
		testStringArtKit
	], logger);
};