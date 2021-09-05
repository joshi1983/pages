import { fetchJson } from '../modules/fetchJson.js';
import { validateCommands } from './logo-migrations/validateCommands.js';
import { wrapAndCall } from './helpers/wrapAndCall.js';

const commandsData = await fetchJson('json/JavaScript/commands.json');

function testJavaScriptCommands(logger) {
	const mockMigrationInfo = {
		'name': 'JavaScript General',
		'commands': commandsData
	};
	validateCommands(mockMigrationInfo, logger);
}

export function testJavaScriptJSON(logger) {
	wrapAndCall([
		testJavaScriptCommands
	], logger);
};