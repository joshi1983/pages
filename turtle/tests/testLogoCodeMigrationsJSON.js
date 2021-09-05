import { Command } from '../modules/parsing/Command.js';
import { fetchJson } from '../modules/fetchJson.js';
import { Keyword } from '../modules/parsing/Keyword.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
await Command.asyncInit();

const pathPrefix = 'json/logo-migrations/';
const migrations = await fetchJson(`${pathPrefix}migratable-tools.json`);
const loadedMigrations = [];
for (let i = 0; i < migrations.length; i++) {
	const migrationInfo = migrations[i];
	const fullInfo = await fetchJson(`${pathPrefix}${migrationInfo}`);
	loadedMigrations.push(fullInfo);
}

function validateBasics(fullInfoObject, logger) {
	const strings = ['name', 'externalLink', 'description'];
	strings.forEach(function(string) {
		if (typeof fullInfoObject[string] !== 'string')
			logger(`Expected ${string} to be a string but got ${fullInfoObject[string]}`);
	});
}

function validateCommands(fullInfoObject, logger) {
	if (!(fullInfoObject.commands instanceof Array))
		logger(`Expected a commands Array but got ${fullInfoObject.commands}`);
	else {
		const lowerCaseNames = new Set();
		fullInfoObject.commands.forEach(function(commandInfo, index) {
			const plogger = prefixWrapper(`Command ${index}, primaryName ${commandInfo.primaryName}`, logger);
			if (index > 0 && typeof commandInfo.primaryName === 'string' && typeof fullInfoObject.commands[index - 1].primaryName === 'string' &&
			commandInfo.primaryName.toLowerCase() <= fullInfoObject.commands[index - 1].primaryName.toLowerCase())
				plogger(`Expected to be sorted by primaryName but found a pair out of order.  ${commandInfo.primaryName} and ${fullInfoObject.commands[index - 1].primaryName}`);
			if (typeof commandInfo.primaryName !== 'string') {
				let extraInfo = '';
				if (index > 0)
					extraInfo = `Previous command's primaryName is ${fullInfoObject.commands[index - 1].primaryName}`;
				plogger(`Expected primaryName to be a string but got ${commandInfo.primaryName}.  ${extraInfo}`);
			}
			else if (lowerCaseNames.has(commandInfo.primaryName.toLowerCase()))
				plogger(`Expected all primaryName and names elements to be unique in lower case but this primaryName was already found.`);
			else
				lowerCaseNames.add(commandInfo.primaryName.toLowerCase());

			if (typeof commandInfo.to !== 'string' && typeof commandInfo.description !== 'string')
				plogger(`Expected either to or description to be a string but neither are.`);
			if (typeof commandInfo.description === 'string' && Command.getCommandInfo(commandInfo.description) !== undefined)
				plogger(`Expected description to not match an existing command but a match was found for description: ${commandInfo.description}.  Did you mean to call the attribute 'to' instead of 'description'?`);
			if (commandInfo.names !== undefined && !(commandInfo.names instanceof Array))
				plogger(`Expected names to be either undefined or an Array but got ${commandInfo.names}.`);
			else if (commandInfo.names instanceof Array) {
				commandInfo.names.forEach(function(name) {
					if (typeof name !== 'string')
						plogger(`Expected all names to be strings but found ${name}`);
					else {
						if (lowerCaseNames.has(name.toLowerCase()))
							plogger(`Expected every primaryName and names element to be distinct in lower case but found duplicate for ${name}`);
						else
							lowerCaseNames.add(name.toLowerCase());
					}
				});
			}
			if (commandInfo.reason !== undefined && typeof commandInfo.reason !== 'string')
				plogger(`Expected reason to either be undefined or a string but got ${commandInfo.reason}`);
			if (typeof commandInfo.to === 'string' && Command.getCommandInfo(commandInfo.to) === undefined)
				plogger(`Expected to find a command named ${commandInfo.to} but it is not found in WebLogo.`);
		});
	}
}

function validateKeywords(fullInfoObject, logger) {
	if (!(fullInfoObject.keywords instanceof Array))
		logger(`Expected a keywords Array but got ${fullInfoObject.keywords}`);
	else {
		fullInfoObject.keywords.forEach(function(keywordInfo, index) {
			const plogger = prefixWrapper(`Keyword ${index}, from ${keywordInfo.from}`, logger);
			if (typeof keywordInfo.from !== 'string')
				plogger(`Expected from to be a string but got ${keywordInfo.from}`);
			if (typeof keywordInfo.to !== 'string')
				plogger(`Expected to to be a string but got ${keywordInfo.to}`);
			if (typeof keywordInfo.to === 'string' && Keyword.getKeywordInfo(keywordInfo.to) === undefined)
				plogger(`Expected to find information on keyword ${keywordInfo.to} but found none in WebLogo.`);
		});
	}
}

function validateOperators(fullInfoObject, logger) {
	if (fullInfoObject.operators === undefined)
		return; // nothing to validate.  undefined is valid, though.

	if (!(fullInfoObject.operators instanceof Array))
		logger(`Expected operators to either be undefined or be an Array but got ${fullInfoObject.operators}`);
	else {
		fullInfoObject.operators.forEach(function(operatorInfo, index) {
			const plogger = prefixWrapper(`Operator ${index}, symbol ${operatorInfo.symbol}`, logger);
			if (typeof operatorInfo.symbol !== 'string')
				plogger(`Expected symbol to be a string but got ${operatorInfo.symbol}`);
			else {
				if (index > 0 && typeof fullInfoObject.operators[index - 1].symbol === 'string' &&
				fullInfoObject.operators[index - 1].symbol >= operatorInfo.symbol)
					plogger(`Expected operators to be sorted by symbol but found a pair out of order.  ${fullInfoObject.operators[index - 1].symbol} and ${operatorInfo.symbol}`);
			}
		});
	}
}

export function testLogoCodeMigrationsJSON(logger) {
	loadedMigrations.forEach(function(loadedMigrationInfo, index) {
		const plogger = prefixWrapper(`Migration ${index}, name ${loadedMigrationInfo.name}`, logger);
		validateBasics(loadedMigrationInfo, plogger);
		validateCommands(loadedMigrationInfo, plogger);
		validateKeywords(loadedMigrationInfo, plogger);
		validateOperators(loadedMigrationInfo, plogger);
	});
};