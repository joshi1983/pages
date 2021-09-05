import { LineSegmentFileFormats } from
'../../../../modules/drawing-menu/download/line-segments/LineSegmentFileFormats.js';

export function testLineSegmentFileFormats(logger) {
	const data = LineSegmentFileFormats.getAllData();
	if (!(data instanceof Array))
		logger(`Expected an Array but got ${data}`);
};