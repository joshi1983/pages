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
					else {
						fileExtension.extraExtensions.forEach(function(ext) {
							if (typeof ext !== 'string')
								plogger(`Every extraExtensions element expected to be a string but got ${ext}`);
							else if (ext.toLowerCase() !== ext)
								plogger(`Every extraExtensions element expected to be a lower case string but got ${ext}`);
						});
					}
				}
				if (!(fileExtension.rawDataSignature instanceof Array))
					plogger(`rawDataSignature expected to be an Array but got ${fileExtension.rawDataSignature}`);
				else {
					fileExtension.rawDataSignature.forEach(function(signatureCheckInfo) {
						if (!(signatureCheckInfo instanceof Array))
							plogger(`rawDataSignature expected to contain only Arrays but got ${signatureCheckInfo}`);
						else if (signatureCheckInfo.length !== 2)
							plogger(`signatureCheckInfo.length expected to be 2 but got ${signatureCheckInfo.length}`);
						else if (!Number.isInteger(signatureCheckInfo[0]))
							plogger(`signatureCheckInfo[0] expected to be an integer but got ${signatureCheckInfo[0]}`);
						else if (signatureCheckInfo[0] < 0)
							plogger(`signatureCheckInfo[0] expected to be at least 0 but got ${signatureCheckInfo[0]}`);
						else if (!(signatureCheckInfo[1] instanceof Array))
							plogger(`signatureCheckInfo[1] expected to be an Array but got ${signatureCheckInfo[1]}`);
						else {
							signatureCheckInfo[1].forEach(function(byteVal) {
								if (!Number.isInteger(byteVal))
									plogger(`byteVal expected to be an integer but got ${byteVal}`);
								else if (byteVal < 0 || byteVal > 255)
									plogger(`byteVal expected to be in 0..255 but got ${byteVal}`);
							});
						}
					});
				}
			}
		});
	}
};