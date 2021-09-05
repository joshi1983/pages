import { ArrayUtils } from '../../modules/ArrayUtils.js';
import { Command } from '../../modules/parsing/Command.js';
import { fetchJson } from '../../modules/fetchJson.js';
import { UnsupportedCommand } from '../../modules/parsing/UnsupportedCommand.js';
await Command.asyncInit();
const data = await fetchJson('prototypes/logo-migration-insights/logo-migration-insights.json');
const migrationLinks = await fetchJson('json/logo-migrations/migratable-tools.json');
const fullInfo = [];
for (let i = 0; i < migrationLinks.length; i++) {
	fullInfo.push(await fetchJson('json/logo-migrations/' + migrationLinks[i]));
}

function getTranslatableCommands() {
	const result = [];
	fullInfo.forEach(function(fullObj) {
		ArrayUtils.pushAll(result,
			fullObj.commands.filter(c => c.to !== undefined));
	});
	return result;
}

function isNewHintName(hintName) {
	if (Command.getCommandInfo(hintName) !== undefined)
		return false;

	const info1 = Command.getCommandInfoByHintName(hintName);
	if (info1 !== undefined)
		return false;

	// Any containing '-' result in false because
	// They're not valid identifiers in WebLogo and won't be parsed 
	// in a way that leads to the hintName having the intended effect.
	if (hintName.indexOf('-') !== -1)
		return false;

	if (UnsupportedCommand.getUnsupportedCommandInfo(hintName.toLowerCase()) !== undefined)
		return false;

	return true;
}

function isBadHint(from, to) {
	return ArrayUtils.indexOfMatch(data.badHints, (badHintPair) => badHintPair[0] === from && badHintPair[1] === to) !== -1;
}

function getHintNamesFromTranslatable(commandInfo) {
	const result = [commandInfo.primaryName];
	if (commandInfo.names instanceof Array)
		ArrayUtils.pushAll(result, commandInfo.names);
	return result;
}

function getHintNames() {
	const translatables = getTranslatableCommands();
	const result = [];
	for (let i = 0; i < translatables.length; i++) {
		const translatable = translatables[i];
		const possibleHintNames = getHintNamesFromTranslatable(translatable).filter(isNewHintName).
			filter((hintName) => !isBadHint(hintName, translatable.to));
		ArrayUtils.pushAll(result, possibleHintNames.map(name => new Result(`Consider adding hintName: ${name.toLowerCase()} to command ${translatable.to}`)));
	}

	return result;
}

class Result {
	constructor(html) {
		this.html = html;
	}
}

function refreshResults() {
	const results = getHintNames();
	const resultUL = document.getElementById('results');
	results.forEach(function(resultInfo) {
		const li = document.createElement('li');
		li.innerHTML = resultInfo.html;
		resultUL.appendChild(li);
	});
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', refreshResults);
else
	refreshResults();