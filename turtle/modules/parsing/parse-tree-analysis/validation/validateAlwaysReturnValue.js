import { Command } from
'../../Command.js';
import { CommandCalls } from
'../CommandCalls.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isUsingAlwaysReturnValue(info) {
	return info.args.some(arg => arg.types.startsWith('cproc') &&
		arg.types.indexOf('returntypes=') !== -1  &&
		arg.types.indexOf('returntypes=null') === -1
	);
}

const names = Command.getAllCommandsInfo().filter(isUsingAlwaysReturnValue).
	map(info => info.primaryName);

function isStopCallFoundIn(proc) {
	const instructionList = proc.getInstructionListToken();
	if (instructionList === undefined)
		return false;

	const tokens = getDescendentsOfType(instructionList, ParseTreeTokenType.PARAMETERIZED_GROUP);
	return CommandCalls.filterCommandCalls(tokens, 'stop').length !== 0;
}

function isOutputCallFoundIn(proc) {
	const instructionList = proc.getInstructionListToken();
	if (instructionList === undefined)
		return false;

	const tokens = getDescendentsOfType(instructionList, ParseTreeTokenType.PARAMETERIZED_GROUP);
	return CommandCalls.filterCommandCalls(tokens, 'output').length !== 0;
}

function getMessageForArgIndex(cachedParseTree, call, argIndex) {
	const tokenValues = cachedParseTree.getTokenValues();
	const procs = cachedParseTree.getProceduresMap();
	const info = Command.getCommandInfo(call.val);
	const args = info.args;
	
	const child = call.children[argIndex];
	if (child === undefined)
		return;

	const cprocName = tokenValues.get(child);
	if (typeof cprocName === 'string') {
		const proc = procs.get(cprocName.toLowerCase());
		if (proc !== undefined) {
			if (isStopCallFoundIn(proc))
				return 'stop command found';
			if (!isOutputCallFoundIn(proc))
				return 'no output command call found';
		}
		else {
			const info = Command.getCommandInfo(cprocName);
			if (info !== undefined && info.returnTypes === null)
				return `command ${info.primaryName} does not return anything.`;
		}
	}
}

function getArgIndexOfInterest(cachedParseTree, call) {
	const info = Command.getCommandInfo(call.val);
	const args = info.args;

	for (let argIndex = 0; argIndex < args.length; argIndex++) {
		if (getMessageForArgIndex(cachedParseTree, call, argIndex) !== undefined)
			return true;
	}
}

function isOfInterest(cachedParseTree) {
	return function(call) {
		return getArgIndexOfInterest(cachedParseTree, call) !== undefined;
	};
}

export function validateAlwaysReturnValue(cachedParseTree, parseLogger) {
	const callsOfInterest = cachedParseTree.getCommandCallsByNames(names).
		filter(isOfInterest(cachedParseTree));
	const tokenValues = cachedParseTree.getTokenValues();
	callsOfInterest.forEach(function(call) {
		const argIndex = getArgIndexOfInterest(cachedParseTree, call);
		const name = tokenValues.get(call.children[argIndex]);
		const msg = getMessageForArgIndex(cachedParseTree, call, argIndex);
		parseLogger.error(`A call to ${call.val} must reference a command or procedure that always returns/outputs a value.  ` +
			`In procedure ${name}, ${msg}.`, call, true);
	});
};