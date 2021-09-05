import { download } from
'../../../../modules/drawing-menu/download/line-segments/download.js';
import { LineSegmentFileFormats } from
'../../../../modules/drawing-menu/download/line-segments/LineSegmentFileFormats.js';

export function testDownload(logger) {
	const format = LineSegmentFileFormats.getFormatInfoAtIndex(0);
	download([], 'test-line-segments-download.' + LineSegmentFileFormats.fileExtension, format);
};