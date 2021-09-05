import { Command } from '../parsing/Command.js';
import { CommandDetails } from './CommandDetails.js';
import { processExampleCount } from './processExampleCount.js';
import { processHelpIds } from './processHelpIds.js';
import { processPastableCode } from './processPastableCode.js';
import { processRestrictedInvokeCommands } from './command-details/processRestrictedInvokeCommands.js';
import { processPointCloudFileFormatsTable } from './processPointCloudFileFormatsTable.js';
import { showDedicatedColorHelp } from './showDedicatedColorHelp.js';
await Command.asyncInit();

function getCommandInfo(text) {
	text = text.trim().toLowerCase().replace(/[-\s]/g, '');
	const beginningsToRemove = ['the'];
	const endingsToRemove = ['statements', 'statement', 'loop', 'command'];
	let commandInfo = Command.getCommandInfo(text);
	if (commandInfo === undefined) {
		endingsToRemove.forEach(function(ending) {
			if (commandInfo === undefined && text.endsWith(ending)) {
				text = text.substring(0, text.length - ending.length);
				commandInfo = Command.getCommandInfo(text);
			}
		});
		commandInfo = Command.getCommandInfo(text);
		if (commandInfo === undefined) {
			beginningsToRemove.forEach(function(beginning) {
				if (commandInfo === undefined && text.startsWith(beginning)) {
					text = text.substring(beginning.length);
					commandInfo = Command.getCommandInfo(text);
				}
			});
		}
	}
	if (commandInfo !== undefined)
		return commandInfo;
}

function processCommandLinks(e) {
	const commandSpans = e.querySelectorAll('.command');
	commandSpans.forEach(function(span) {
		const commandInfo = getCommandInfo(span.innerText);
		if (commandInfo !== undefined && !span.hasAttribute('title')) {
			span.setAttribute('title', 'Learn more about command ' + commandInfo.primaryName);
			span.classList.add('hyperlinked');
			span.addEventListener('click', function() {
				CommandDetails.showDetails(commandInfo.primaryName);
			});
		}
	});
}

function processDetailedColorLinks(e) {
	const colorSpans = e.querySelectorAll('.help-color-details');
	colorSpans.forEach(function(span) {
		if (!span.hasAttribute('title')) {
			span.setAttribute('title', 'Learn more about colors');
			span.classList.add('hyperlinked');
			span.addEventListener('click', function() {
				showDedicatedColorHelp();
			});
		}
	});
}

/*
You can be very specific with the element you want to process help links in.
This will default to the whole document.
*/
export function processHelpLinks(e, syntaxHighlightCodeElements) {
	if (e === undefined)
		e = document;
	if (syntaxHighlightCodeElements === undefined)
		syntaxHighlightCodeElements = false;

	processRestrictedInvokeCommands(e);
	processCommandLinks(e);
	processDetailedColorLinks(e);
	processExampleCount(e);
	processHelpIds(e instanceof Element ? e : undefined);
	processPastableCode(e, syntaxHighlightCodeElements);
	processPointCloudFileFormatsTable(e);
}