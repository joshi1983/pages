import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testDownload } from './download/testDownload.js';
import { testShapeExplorer } from './shape-explorer/testShapeExplorer.js';

export function testDrawingMenu(logger) {
	testDownload(prefixWrapper('testDownload', logger));
	testShapeExplorer(prefixWrapper('testShapeExplorer', logger));
};