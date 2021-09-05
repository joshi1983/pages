import { Command } from '../modules/parsing/Command.js';
import { fetchJson } from '../modules/fetchJson.js';
import { Keyword } from '../modules/parsing/Keyword.js';
import { Operators } from '../modules/parsing/Operators.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
import { sanitizeForLogoMigration, sanitizerMap } from
'../modules/components/code-editor/code-fixer/fixers/helpers/sanitization/sanitizeForLogoMigration.js';
await Command.asyncInit();
await Operators.asyncInit();

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
	if (fullInfoObject.toProcPath !== undefined && typeof fullInfoObject.toProcPath !== 'string')
		logger(`Expected toProcPath to be a string but it is ${fullInfoObject.toProcPath}`);
	if (fullInfoObject.caseSensitiveCommandNames !== undefined &&
	typeof fullInfoObject.caseSensitiveCommandNames !== 'boolean')
		logger(`Expected caseSensitiveCommandNames to be boolean but got ${fullInfoObject.caseSensitiveCommandNames}`);
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
			else if (fullInfoObject.caseSensitiveCommandNames !== true) {
				if (lowerCaseNames.has(commandInfo.primaryName.toLowerCase()))
					plogger(`Expected all primaryName and names elements to be unique in lower case but this primaryName was already found.`);
				else
					lowerCaseNames.add(commandInfo.primaryName.toLowerCase());
			}
			if (commandInfo.args !== undefined) {
				if (!(commandInfo.args instanceof Array))
					plogger(`Expected args to be an Array but got ${commandInfo.args}`);
				else {
					commandInfo.args.forEach(function(argInfo, index) {
						if (typeof argInfo !== 'object')
							plogger(`Expected argInfo to be an object but got ${argInfo} at index ${index}`);
						else if (typeof argInfo.name !== 'string')
							plogger(`Expected argInfo.name to be a string but got ${argInfo.name} at index ${index}`);
					});
				}
			}
			if (commandInfo.convertToUnaryOperator !== undefined) {
				if (typeof commandInfo.convertToUnaryOperator !== 'string')
					plogger(`Expected convertToUnaryOperator to either be undefined or a string but got ${commandInfo.convertToUnaryOperator}`);
				else {
					const operatorInfo = Operators.getOperatorInfo(commandInfo.convertToUnaryOperator);
					if (operatorInfo === undefined)
						plogger(`Expected to find a WebLogo operator with symbol ${commandInfo.convertToUnaryOperator} but not found`);
					else if (typeof operatorInfo.unary !== 'object')
						plogger(`Expected to find unary information in the WebLogo operator with symbol ${commandInfo.convertToUnaryOperator} but not found.  Check if the operator is strictly binary.`);
				}
			}
			if (commandInfo.isReadingRegister !== undefined && typeof commandInfo.isReadingRegister !== 'boolean')
				plogger(`isReadingRegister expected to either be left undefined or a boolean but found ${commandInfo.isReadingRegister}`);
			if (commandInfo.isWritingToRegister !== undefined && typeof commandInfo.isWritingToRegister !== 'boolean')
				plogger(`isWritingToRegister expected to either be left undefined or a boolean but found ${commandInfo.isWritingToRegister}`);
			if (typeof commandInfo.to !== 'string' && typeof commandInfo.toProc !== 'string' && typeof commandInfo.description !== 'string')
				plogger(`Expected to, toProc, or description to be a string but neither are.`);
			if (commandInfo.toProc !== undefined) {
				if (typeof commandInfo.toProc !== 'string')
					plogger(`Expected toProc to either be undefined or to be a string but found ${commandInfo.toProc}.`);
				else if (Command.getCommandInfo(commandInfo.toProc) !== undefined)
					plogger(`Expected toProc to not match any command but one was found matching ${commandInfo.toProc}.  Did you mean to use "to" instead of "toProc"?`);
			}
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
			if (commandInfo.reverseArgs !== undefined && typeof commandInfo.reverseArgs !== 'boolean')
				plogger(`Expected reverseArgs to either be undefined or a boolean but got ${commandInfo.reverseArgs}`);
			if (commandInfo.removeInMigration !== undefined) {
				if (typeof commandInfo.removeInMigration !== 'boolean')
					plogger(`Expected removeInMigration to either be undefined or be boolean but got ${commandInfo.removeInMigration}`);
				if (commandInfo.removeInMigration === true) {
					if (commandInfo.to !== undefined)
						plogger(`When removeInMigration is true, expected to to be undefined but got ${commandInfo.to}`);
					if (commandInfo.toProc !== undefined)
						plogger(`When removeInMigration is true, expected toProc to be undefined but got ${commandInfo.toProc}`);
				}
			}
			if (commandInfo.reason !== undefined && typeof commandInfo.reason !== 'string')
				plogger(`Expected reason to either be undefined or a string but got ${commandInfo.reason}`);
			if (typeof commandInfo.to === 'string' && Command.getCommandInfo(commandInfo.to) === undefined)
				plogger(`Expected to find a command named ${commandInfo.to} but it is not found in WebLogo.`);
			if (typeof commandInfo.argLengthConditionalTo === 'string' && Command.getCommandInfo(commandInfo.argLengthConditionalTo) === undefined)
				plogger(`Expected to find a command named ${commandInfo.argLengthConditionalTo} but it is not found in WebLogo.`);
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
			if (typeof keywordInfo.to !== 'string' && keywordInfo.to !== null)
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
				fullInfoObject.operators[index - 1].symbol >= operatorInfo.symbol) {
					const symbols = fullInfoObject.operators.map(op => op.symbol);
					symbols.sort();
					const sortedMsg = symbols.join(', ');
					plogger(`Expected operators to be sorted by symbol but found a pair out of order.  ${fullInfoObject.operators[index - 1].symbol} and ${operatorInfo.symbol}.  ${operatorInfo.symbol} should be first/(earlier or higher file).  The fully sorted operator symbols are: ${sortedMsg}`);
				}
			}
			if (operatorInfo.precedence !== undefined && !Number.isInteger(operatorInfo.precedence))
				plogger(`Expected precedence to either be undefined or an integer but got ${operatorInfo.precedence}`);
			if (operatorInfo.to !== undefined) {
				if (typeof operatorInfo.to !== 'string')
					plogger(`Expected to to be a string but got ${operatorInfo.to}`);
			}
			if (operatorInfo.convertToCommand !== undefined) {
				if (typeof operatorInfo.convertToCommand !== 'string')
					plogger(`Expected convertToCommand to be a string but got ${operatorInfo.convertToCommand}`);
				else {
					const info = Command.getCommandInfo(operatorInfo.convertToCommand);
					if (info === undefined)
						plogger(`convertToCommand expected to match a WebLogo command but did not find a command for ${operatorInfo.convertToCommand}`);
				}
			}
		});
	}
}

function validateAlternativeLinks(fullInfoObject, logger) {
	if (fullInfoObject.alternativeLinks !== undefined) {
		if (!(fullInfoObject.alternativeLinks instanceof Array))
			logger(`Expected alternativeLinks to either be undefined or be an Array but got ${fullInfoObject.alternativeLinks}`);
		else {
			fullInfoObject.alternativeLinks.forEach(function(url) {
				if (typeof url !== 'string')
					logger(`Expected every alternativeLinks element to be a string but found ${url}`);
				else {
					if (!url.startsWith('http://') && !url.startsWith('https://'))
						logger(`A alternativeLinks URL should start with either http:// or https:// but found ${url}`);
				}
			});
		}
	}
}

function validateSanitization(fullInfoObject, logger) {
	if (fullInfoObject.sanitization === undefined)
		return;
	if (!(fullInfoObject.sanitization instanceof Array))
		logger(`sanitization expected to either be undefined or an Array but got ${fullInfoObject.sanitization}`);
	else {
		fullInfoObject.sanitization.forEach(function(element) {
			if (typeof element !== 'string')
				logger(`Expected every element in sanitization to be a string but got ${element}`);
			else if (!sanitizerMap.has(element))
				logger(`Expected to find name ${element} in sanitizerMap but did not.  sanitizerMap has the keys ${Array.from(sanitizerMap.keys()).join(',')}`);
		});
	}
}

export function testLogoCodeMigrationsJSON(logger) {
	loadedMigrations.forEach(function(loadedMigrationInfo, index) {
		const plogger = prefixWrapper(`Migration ${index}, name ${loadedMigrationInfo.name}`, logger);
		validateAlternativeLinks(loadedMigrationInfo, plogger);
		validateBasics(loadedMigrationInfo, plogger);
		validateCommands(loadedMigrationInfo, plogger);
		validateKeywords(loadedMigrationInfo, plogger);
		validateOperators(loadedMigrationInfo, plogger);
		validateSanitization(loadedMigrationInfo, plogger);
	});
};