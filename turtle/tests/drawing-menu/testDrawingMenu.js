import { testDownload } from './download/testDownload.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testDrawingMenu(logger) {
	wrapAndCall([
		testDownload
	], logger);
};