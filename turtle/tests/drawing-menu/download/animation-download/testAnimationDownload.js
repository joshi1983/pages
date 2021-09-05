import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testFormatFilename } from './testFormatFilename.js';
import { testFormatGifFilename } from './testFormatGifFilename.js';
import { testGetAnimationSettingsFromLocalStorage } from './testGetAnimationSettingsFromLocalStorage.js';
import { testGetPreferredFrameSequenceFormatMime } from './testGetPreferredFrameSequenceFormatMime.js';
import { testGetRasterSnapshot } from './testGetRasterSnapshot.js';

export function testAnimationDownload(logger) {
	testFormatFilename(prefixWrapper('testFormatFilename', logger));
	testFormatGifFilename(prefixWrapper('testFormatGifFilename', logger));
	testGetAnimationSettingsFromLocalStorage(prefixWrapper('testGetAnimationSettingsFromLocalStorage', logger));
	testGetPreferredFrameSequenceFormatMime(prefixWrapper('testGetPreferredFrameSequenceFormatMime', logger));
	testGetRasterSnapshot(prefixWrapper('testAnimationDownload', logger));
};