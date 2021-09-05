import { isLikelyHTMLProjectExportFromSugarLabsTurtleBlocks } from './isLikelyHTMLProjectExportFromSugarLabsTurtleBlocks.js';
import { isLikelySugarLabsTurtleBlocksJSON } from './isLikelySugarLabsTurtleBlocksJSON.js';

export function isLikelySugarLabsTurtleBlocks(code) {
	return isLikelySugarLabsTurtleBlocksJSON(code) ||
		isLikelyHTMLProjectExportFromSugarLabsTurtleBlocks(code);
};