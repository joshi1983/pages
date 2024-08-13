import { testFormatFilename } from './testFormatFilename.js';
import { testFormatGifFilename } from './testFormatGifFilename.js';
import { testGetAnimationSettingsFromLocalStorage } from './testGetAnimationSettingsFromLocalStorage.js';
import { testGetPreferredFrameSequenceFormatMime } from './testGetPreferredFrameSequenceFormatMime.js';
import { testGetRasterSnapshot } from './testGetRasterSnapshot.js';
import { testGetThumbnailDimensions } from './testGetThumbnailDimensions.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testAnimationDownload(logger) {
	wrapAndCall([
		testFormatFilename,
		testFormatGifFilename,
		testGetAnimationSettingsFromLocalStorage,
		testGetPreferredFrameSequenceFormatMime,
		testGetRasterSnapshot,
		testGetThumbnailDimensions
	], logger);
};