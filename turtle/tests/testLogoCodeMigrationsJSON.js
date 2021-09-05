import { fetchJson } from '../modules/fetchJson.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
import { validateAlternativeLinks } from './logo-migrations/validateAlternativeLinks.js';
import { validateBasics } from './logo-migrations/validateBasics.js';
import { validateCommands } from './logo-migrations/validateCommands.js';
import { validateKeywords } from './logo-migrations/validateKeywords.js';
import { validateLogoCodeMigrationOperators } from './logo-migrations/validateLogoCodeMigrationOperators.js';
import { validateSanitization } from './logo-migrations/validateSanitization.js';

const pathPrefix = 'json/logo-migrations/';
const migrations = await fetchJson(`${pathPrefix}migratable-tools.json`);
const loadedMigrations = [];
for (let i = 0; i < migrations.length; i++) {
	const migrationInfo = migrations[i];
	const fullInfo = await fetchJson(`${pathPrefix}${migrationInfo}`);
	loadedMigrations.push(fullInfo);
}

export function testLogoCodeMigrationsJSON(logger) {
	loadedMigrations.forEach(function(loadedMigrationInfo, index) {
		const plogger = prefixWrapper(`Migration ${index}, name ${loadedMigrationInfo.name}`, logger);
		validateAlternativeLinks(loadedMigrationInfo, plogger);
		validateBasics(loadedMigrationInfo, plogger);
		validateCommands(loadedMigrationInfo, plogger);
		validateKeywords(loadedMigrationInfo, plogger);
		validateLogoCodeMigrationOperators(loadedMigrationInfo, plogger);
		validateSanitization(loadedMigrationInfo, plogger);
	});
};