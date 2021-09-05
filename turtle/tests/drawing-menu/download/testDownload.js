import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testAnimationDownload } from './animation-download/testAnimationDownload.js';
import { testDrawingDownload } from './drawing-download/testDrawingDownload.js';
import { testFileExtensions } from './testFileExtensions.js';
import { testFileExtensionsJSON } from './testFileExtensionsJSON.js';
import { testFrameRates } from './testFrameRates.js';
import { testPDF } from './pdf/testPDF.js';
import { testPointClouds } from './point-clouds/testPointClouds.js';
import { testPostScript } from './post-script/testPostScript.js';
import { testStringArtKit } from './string-art-kit/testStringArtKit.js';

export function testDownload(logger) {
	testAnimationDownload(prefixWrapper('testAnimationDownload', logger));
	testDrawingDownload(prefixWrapper('testDrawingDownload', logger));
	testFileExtensions(prefixWrapper('testFileExtensions', logger));
	testFileExtensionsJSON(prefixWrapper('testFileExtensionsJSON', logger));
	testFrameRates(prefixWrapper('testFrameRates', logger));
	testPDF(prefixWrapper('testPDF', logger));
	testPointClouds(prefixWrapper('testPointClouds', logger));
	testPostScript(prefixWrapper('testPostScript', logger));
	testStringArtKit(prefixWrapper('testStringArtKit', logger));
};