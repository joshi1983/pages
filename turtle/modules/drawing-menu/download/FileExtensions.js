import { fetchJson } from '../../fetchJson.js';
const data = await fetchJson('json/fileExtensions.json');
const mimeMap = new Map();
data.forEach(function(extensionInfo) {
	mimeMap.set(extensionInfo.mime, extensionInfo);
});

class PrivateFileExtensions {
	addOptionsToSelect(selectElement, isIncluded) {
		data.filter(function(format) {
			if (typeof isIncluded === 'function')
				return isIncluded(format);
			else
				return true;
		}).forEach(function(mimeInfo) {
			const option = document.createElement('option');
			option.setAttribute('value', mimeInfo.mime);
			option.innerText = mimeInfo.name;
			selectElement.appendChild(option);
		});
	}

	getAll() {
		return data;
	}

	getFileExtensionFromFilename(filename) {
		const index = filename.lastIndexOf('.');
		if (index !== -1) {
			filename = filename.substring(index + 1).toLowerCase();
			if (filename.indexOf('/') !== -1 || filename.indexOf('\\') !== -1)
				return undefined;
			return filename;
		}
	}

	getFileExtensionFromMime(mime) {
		return mimeMap.get(mime).fileExtension;
	}

	getMimeFromExtension(extension) {
		if (typeof extension !== 'string')
			throw new Error('extension must be a string.  It must either be a filename or just the extension.  Not: ' + extension);
		// if a file name is passed in, get the file extension.
		if (extension.indexOf('.') !== -1)
			extension = this.getFileExtensionFromFilename(extension);
		else
			extension = extension.toLowerCase();
		for (let i = 0; i < data.length; i++) {
			if (data[i].fileExtension === extension)
				return data[i].mime;
			if ((data[i].extraExtensions instanceof Array) && data[i].extraExtensions.indexOf(extension) !== -1)
				return data[i].mime;
		}
		return 'application/octet-stream';
	}
}

const FileExtensions = new PrivateFileExtensions();
export { FileExtensions };