import { fetchJson } from '../../../modules/fetchJson.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
const data = await fetchJson('json/fileExtensions.json');

export function testFileExtensionsJSON(logger) {
	if (!(data instanceof Array))
		logger('fileExtensions.json should define an Array but it does not.  Got: ' + data);
	else {
		data.forEach(function(fileExtension, index) {
			const plogger = prefixWrapper(`Case ${index}`, logger);
			if (typeof fileExtension !== 'object')
				plogger('object expected.  Got: ' + fileExtension);
			else {
				if (typeof fileExtension.name !== 'string')
					plogger('name must be a string.  Got: ' + fileExtension.name);
				if (typeof fileExtension.mime !== 'string')
					plogger('mime must be a string.  Got: ' + fileExtension.mime);
				if (typeof fileExtension.fileExtension !== 'string')
					plogger('fileExtension must be a string but got ' + fileExtension.fileExtension);
				else if (fileExtension.fileExtension.toLowerCase() !== fileExtension.fileExtension)
					plogger('fileExtension expected to be in lower case but got ' + fileExtension.fileExtension);
				if (fileExtension.extraExtensions !== undefined) {
					if (!(fileExtension.extraExtensions instanceof Array))
						plogger('extraExtensions expected to be either undefined or an Array.  Got: ' + fileExtension.extraExtensions);
				}
			}
		});
	}
};