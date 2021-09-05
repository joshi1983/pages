import { testGetTotalFrameDownloadCount } from
'./testGetTotalFrameDownloadCount.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testModes(logger) {
	wrapAndCall([
		testGetTotalFrameDownloadCount
	], logger);
};