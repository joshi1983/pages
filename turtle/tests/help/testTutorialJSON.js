import { fetchJson } from '../../modules/fetchJson.js';
import { fetchText } from '../../modules/fetchText.js';
const tutorial = await fetchJson('json/tutorial.json');

export function testTutorialJSON(logger) {
	if (!(tutorial instanceof Array))
		logger('tutorial expected to be an Array');
	else {
		tutorial.forEach(function(pageInfo, index) {
			if (typeof pageInfo.filename !== 'string')
				logger('filename must be a string but is not for index ' + index);
			if (typeof pageInfo.name !== 'string')
				logger('name must be a string but is not for index ' + index);
			fetchText('content/help/tutorial/' + pageInfo.filename).
				catch(e => logger('Failed to load page ' + pageInfo.filename + ', error: ' + e));
		});
	}
};