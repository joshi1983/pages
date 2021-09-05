import { Code } from '../../components/code-editor/Code.js';
import { FileExtensions } from './FileExtensions.js';

export function getFilename(mime) {
	const i = mime.indexOf('/');
	let withoutExtension = Code.getFileName();
	const extensionIndex = withoutExtension.lastIndexOf('.');
	if (extensionIndex !== -1)
		withoutExtension = withoutExtension.substring(0, extensionIndex + 1);
	return withoutExtension + FileExtensions.getFileExtensionFromMime(mime);
};