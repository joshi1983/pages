import { fetchJson } from '../../modules/fetchJson.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
const data = await fetchJson('json/glossary.json');

function validateGlossaryTermInfo(info, logger) {
	if (typeof info !== 'object')
		logger(`object expected but got ${info}`);
	else if (typeof info.name !== 'string')
		logger(`info.name must be a string but got ${info.name}`);
	else if (typeof info.definition !== 'string')
		logger(`info.definition must be a string but got ${info.definition}`);
	else if (info.examples !== undefined && !(info.examples instanceof Array))
		logger(`info.examples must either be undefined or an Array.  info.examples = ${info.examples}`);
	else if (info.examples instanceof Array) {
		info.examples.forEach(function(example) {
			if (typeof example !== 'string')
				logger(`Example must be a string but got ${example}`);
		});
	}
}

export function testGlossaryJSON(logger) {
	if (!(data instanceof Array))
		logger(`Array expected but got ${data}`);
	else {
		data.forEach(function(info, index) {
			const plogger = prefixWrapper(`Term ${index}`, logger);
			validateGlossaryTermInfo(info, plogger);
		});
	}
};