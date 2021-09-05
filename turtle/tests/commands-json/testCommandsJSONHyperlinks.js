import { fetchJson } from '../../modules/fetchJson.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
const commands = await fetchJson('json/commands.json');

export function testCommandsJSONHyperlinks(logger) {
	commands.
		filter(ci => typeof ci.description === 'string' && ci.description.toLowerCase().indexOf('<a') !== -1).
		forEach(function(commandInfo) {
			const prefixLogger = prefixWrapper('Command ' + commandInfo.primaryName, logger);
			const e = document.createElement('div');
			e.innerHTML = commandInfo.description;
			const hyperlinks = e.querySelectorAll('a[href]');
			hyperlinks.forEach(function(a) {
				if (!a.hasAttribute('target'))
					prefixLogger('a link to ' + a.getAttribute('href') + ' expected to have target="_blank" but does not set target attribute');
				else if (a.getAttribute('target').toLowerCase() !== '_blank')
					prefixLogger('target expected to be _blank but got ' + a.getAttribute('target'));
			});
		});
};