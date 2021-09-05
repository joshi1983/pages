import { FileExtensions } from '../../../../modules/drawing-menu/download/FileExtensions.js';
import { getPreferredFrameSequenceFormatMime } from 
	'../../../../modules/drawing-menu/download/animation-download/getPreferredFrameSequenceFormatMime.js';

export function testGetPreferredFrameSequenceFormatMime(logger) {
	const mime = getPreferredFrameSequenceFormatMime();
	const format = FileExtensions.getFileExtensionFromMime(mime);
	if (typeof format !== 'string')
		logger('format expected to be a string but got: ' + format +
			'.  Make sure the mime returned by getPreferredFrameSequenceFormatMime() matches one of the mime values in json/fileExtensions.json.');
};