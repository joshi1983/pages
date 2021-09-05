import { downloadDataUrl } from '../../../components/downloadDataUrl.js';
import { getDataURLForDrawingTransformerAndMime } from './getDataURLForDrawingTransformerAndMime.js';
import { getFilename } from '../getFilename.js';

export async function previewerDownload(drawing, transformer, mime) {
	if (typeof mime !== 'string')
		throw new Error('mime must be a string');
	const dataUrl = await getDataURLForDrawingTransformerAndMime(drawing, transformer, mime);
	downloadDataUrl(getFilename(mime), dataUrl);
};