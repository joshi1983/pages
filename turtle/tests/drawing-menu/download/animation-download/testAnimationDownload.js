import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testFormatFilename } from './testFormatFilename.js';
import { testGetPreferredFrameSequenceFormatMime } from './testGetPreferredFrameSequenceFormatMime.js';
import { testGetRasterSnapshot } from './testGetRasterSnapshot.js';

export function testAnimationDownload(logger) {
	testFormatFilename(prefixWrapper('testFormatFilename', logger));
	testGetPreferredFrameSequenceFormatMime(prefixWrapper('testGetPreferredFrameSequenceFormatMime', logger));
	testGetRasterSnapshot(prefixWrapper('testAnimationDownload', logger));
};