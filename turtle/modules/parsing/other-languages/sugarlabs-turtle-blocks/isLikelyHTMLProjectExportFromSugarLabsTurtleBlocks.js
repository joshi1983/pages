import { htmlProjectExportToJSON } from './htmlProjectExportToJSON.js';
import { isLikelySugarLabsTurtleBlocksJSON } from './isLikelySugarLabsTurtleBlocksJSON.js';

const requiredRegexes = [
	/\<html[\s\>]/i,
	/\<body[\s\>]/i,
	/\[\s*\[\s*/,
];

export function isLikelyHTMLProjectExportFromSugarLabsTurtleBlocks(code) {
	// For better performance, look for ways we can avoid a slower HTML parse.
	if (code.indexOf('class="code"') === -1)
		return false;
	for (const regex of requiredRegexes) {
		if (!regex.test(code))
			return false;
	}

	code = htmlProjectExportToJSON(code);
	if (code === undefined)
		return false;
	return isLikelySugarLabsTurtleBlocksJSON(code);
};