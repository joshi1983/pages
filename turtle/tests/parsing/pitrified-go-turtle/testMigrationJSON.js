import { Command } from
'../../../modules/parsing/Command.js';
import { fetchJson } from
'../../../modules/fetchJson.js';
import { getPackageAliases } from
'../../../modules/parsing/pitrified-go-turtle/MigrationInfo.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

const data = await fetchJson('json/logo-migrations/pitrified-go-turtle/migration.json');
const procFiles = await fetchJson('logo-scripts/go-content/index.json');
const procNames = new Set(procFiles.map(name => name.substring(0, name.length - 4)));
await Command.asyncInit();

function validateConstantOrFunctionBasics(a, packageAliases, logger) {
	if (!(a instanceof Array))
		logger(`expected to be an Array but found ${a}`);
	else {
		a.forEach(function(info, index) {
			if (typeof info !== 'object' || info === null) {
				logger(`[${index}] expected to be an object but found ${info}`);
			}
			else {
				const plogger = prefixWrapper(`index ${index}, name=${info.name}`, logger);
				if (typeof info.name !== 'string')
					plogger(`name must be a string but found ${info.name}`);
				else if (index !== 0) {
					const prev = a[index - 1];
					if (typeof prev === 'object' && typeof prev.name === 'string') {
						if (prev.name.localeCompare(info.name) > 0)
							plogger(`must be ordered by name but the pair are out of order. previous name=${prev.name}, name=${info.name}`);
					}
				}
				if (info.to !== undefined) {
					if (typeof info.to !== 'string')
						plogger(`to must be a string but found ${info.to}`);
					else {
						const commandInfo = Command.getCommandInfo(info.to);
						if (commandInfo === undefined) {
							plogger(`Unable to find a WebLogo command matching to=${info.to}`);
						}
						else if (commandInfo.primaryName !== info.to) {
							plogger(`Found a command matching ${info.to} but the primaryName does not exactly match.  The primaryName is ${commandInfo.primaryName}.  We suggest you set "to": ${commandInfo.primaryName}`);
						}
					}
				}
				if (info.migrateToCode !== undefined && typeof info.migrateToCode !== 'string') {
					plogger(`migrateToCode must be undefined or a string but found ${info.migrateToCode}`);
				}
				if (typeof info.package !== 'string') {
					plogger(`package must be a string but found ${info.package}`);
				}
				else if (info.package[0] === '@') {
					if (!packageAliases.has(info.package.substring(1)))
						plogger(`Unable to find package alias named ${info.package.substring(1)}`);
				}
				if (info.class !== undefined && typeof info.class !== 'string') {
					plogger(`class must be either undefined or a string but found ${info.class}`);
				}
			}
		});
	}
}

export function testMigrationJSON(logger) {
	if (typeof data !== 'object')
		logger(`Migration data must be an object but found ${data}`);
	else {
		if (data.packageAliases !== undefined &&
		!(data.packageAliases instanceof Array))
			logger(`packageAliases must be an Array but found ${data.packageAliases}`);
		else {
			data.packageAliases.forEach(function(packageAlias, paIndex) {
				const palogger = prefixWrapper(`Package Alias ${paIndex}`, logger);
				if (typeof packageAlias.name !== 'string')
					palogger(`name must be a string but found ${packageAlias.name}`);
				if (typeof packageAlias.url !== 'string')
					palogger(`url must be a string but found ${packageAlias.url}`);
			});
		}
		const packageAliases = getPackageAliases(data.packageAliases);
		validateConstantOrFunctionBasics(data.functions, packageAliases, prefixWrapper('functions', logger));
		validateConstantOrFunctionBasics(data.constants, packageAliases, prefixWrapper('constants', logger));
		if (data.functions instanceof Array) {
			data.functions.forEach(function(info, index) {
				if (typeof info !== 'object')
					return;

				const plogger = prefixWrapper(`index ${index}, name=${info.name}`, logger);
				if (info.removeInMigration !== undefined &&
				typeof info.removeInMigration !== 'boolean') {
					plogger(`removeInMigration must be boolean but found ${info.removeInMigration}`);
				}
				if (info.toProc !== undefined) {
					if (typeof info.toProc !== 'string')
						plogger(`toProc must be a string but found ${info.toProc}`);
					else if (!procNames.has(info.toProc))
						plogger(`Unable to find ${info.toProc} in the associated index.json file.  Did you run gulpfile indexes lately?`);
				}
			});
		}
	}
};