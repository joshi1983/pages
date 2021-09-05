import { fetchJson } from '../../../../modules/fetchJson.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
const data = await fetchJson('json/pointCloudFormats.json');

export function testPointCloudFormatsJSON(logger) {
	if (!(data instanceof Array))
		logger(`pointCloudFormats.json should define an Array but got ${data}`);
	else {
		data.forEach(function(formatInfo, index) {
			const plogger = prefixWrapper(`Format ${index} with name ${formatInfo.name}`, logger);
			if (typeof formatInfo.name !== 'string')
				plogger(`name required to be a string but got ${formatInfo.name}`);
			else if (index > 0 && typeof data[index - 1].name === 'string' && formatInfo.name.localeCompare(data[index - 1].name) <= 0)
				plogger(` is alphabetically out of order with previous format ${data[index - 1].name}`);
			if (typeof formatInfo.fileExtension !== 'string')
				plogger(`fileExtension must be a string but got ${formatInfo.fileExtension}`);
			if (formatInfo.description !== undefined && typeof formatInfo.description !== 'string')
				plogger(`If description is specified, it must be a string but found ${formatInfo.description}`);
			if (typeof formatInfo.supportsColour !== 'boolean')
				plogger(`supportsColour must be boolean but found ${formatInfo.supportsColour}`);
			if (formatInfo.opensWith !== undefined) {
				if (!(formatInfo.opensWith instanceof Array))
					plogger(`If opensWith is specified, it must be an Array but found ${formatInfo.opensWith}`);
				else {
					formatInfo.opensWith.forEach(function(openWithInfo) {
						if (typeof openWithInfo !== 'string')
							plogger(`Every element in opensWith must be a string but found ${openWithInfo}`);
					});
				}
			}
		});
	}
};