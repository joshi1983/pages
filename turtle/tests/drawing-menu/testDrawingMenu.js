import { testDownload } from './download/testDownload.js';
import { testShapeExplorer } from './shape-explorer/testShapeExplorer.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testDrawingMenu(logger) {
	wrapAndCall([
		testDownload,
		//testShapeExplorer
	], logger);
};