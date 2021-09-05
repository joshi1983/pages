import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { ForLoops } from '../ForLoops.js';
import { getProcedureStartToken } from '../getProcedureStartToken.js';
import { isOutputOrStopToken } from '../isOutputOrStopToken.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { scrapeProceduresFromParseTreeTokens } from '../scrapeProceduresFromParseTreeTokens.js';

/*
Developers may actually want an infinite loop in Logo but it would be very rare.

They might want to just trace how the loop behaves and see why it is infinite.

This is so extremely rare and most-likely a mistake, though.  
Therefore, they should be warned.

There are many ways to have an infinite loop that aren't detected here but 
warning about a few obvious cases still seems helpful.
*/

const procNamesWithNoInfiniteLoops = new Set(['animation.setup', 'animation.snapshotstyle']);

function isAlwaysTrueToken(token, cachedParseTree) {
	const tokenValues = cachedParseTree.getTokenValues();
	const val = tokenValues.get(token);
	return val !== undefined && val;
}

function checkTokenInProhibitedProcedure(token, parseLogger) {
	const procToken = getProcedureStartToken(token);
	if (procToken === undefined || procToken.children.length === 0)
		return false;
	const procName = procToken.children[0].val.toLowerCase();
	if (procNamesWithNoInfiniteLoops.has(procName)) {
		parseLogger.error('Infinite loops are not allowed in procedure ' + procName, token);
	}
}

function validateDoWhileLoops(cachedParseTree, parseLogger) {
	const doWhileLoops = cachedParseTree.getCommandCallsByName('do.while').filter(function(token) {
		if (!isAlwaysTrueToken(token.children[1], cachedParseTree))
			return false;
		return token.getAllDescendentsAsArray().
			filter(isOutputOrStopToken).length === 0;
	});
	doWhileLoops.forEach(function(loopToken) {
		parseLogger.warn('This do-while-loop will never halt.  It is an infinite loop.', loopToken);
		checkTokenInProhibitedProcedure(loopToken, parseLogger);
	});
}

function validateForeverLoops(cachedParseTree, parseLogger) {
	const foreverLoops = cachedParseTree.getCommandCallsByName('forever').filter(function(token) {
		return token.getAllDescendentsAsArray().
			filter(isOutputOrStopToken).length === 0;
	});
	foreverLoops.forEach(function(foreverLoopToken) {
		parseLogger.warn('This forever-loop will never halt.  It is an infinite loop.', foreverLoopToken);
		checkTokenInProhibitedProcedure(foreverLoopToken, parseLogger);
	});
}

function validateInfiniteWhileLoops(cachedParseTree, parseLogger) {
	const infiniteWhileLoops = cachedParseTree.getCommandCallsByName('while').filter(function(token) {
		if (!isAlwaysTrueToken(token.children[0], cachedParseTree))
			return false;
		return token.getAllDescendentsAsArray().
			filter(isOutputOrStopToken).length === 0;
	});
	infiniteWhileLoops.forEach(function(whileLoopToken) {
		parseLogger.warn('This while-loop will never halt.  It is an infinite loop.', whileLoopToken);
		checkTokenInProhibitedProcedure(whileLoopToken, parseLogger);
	});
}

function isIfElseAlwaysCallingProcedure(procName, ifElseToken) {
	const children = ifElseToken.children;
	if (children.length !== 3) // if invalid number of children
		return false;
	if (children[1].type !== ParseTreeTokenType.LIST ||
		children[2].type !== ParseTreeTokenType.LIST)
		return false; // if the children are not valid instruction lists, assume we're not calling the procedure in them.

	return isInstructionListAlwaysCallingProc(procName, children[1]) &&
		isInstructionListAlwaysCallingProc(procName, children[2]);
}

function isAlwaysCallingProcedure(procName, token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		if (token.val.toLowerCase() === procName)
			return true;
		const commandInfo = Command.getCommandInfo(token.val);
		if (commandInfo !== undefined && commandInfo.primaryName === 'ifelse')
			return isIfElseAlwaysCallingProcedure(procName, token);
	}
	return false;
}

function mightOutputOrStopBeforeCallingProc(procName, instruction) {
	const commandInfo = Command.getCommandInfo(instruction.val);
	if (commandInfo !== undefined) {
		if (['output', 'stop'].indexOf(commandInfo.primaryName) !== -1)
			return true;
		else if (['for', 'if', 'repeat', 'while'].indexOf(commandInfo.primaryName) !== -1 && instruction.children.length === 2) {
			if (mightInstructionListOutputOrStopBeforeCallingProc(procName, instruction.children[1]))
				return true;
		}
		else if (isAlwaysCallingProcedure(procName, instruction))
			return false;
	}
	return false;
}

function mightInstructionListOutputOrStopBeforeCallingProc(procName, listToken) {
	const instructions = listToken.children;
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			if (mightOutputOrStopBeforeCallingProc(procName, instruction))
				return true;
		}
	}
	return false;
}

function isInstructionListAlwaysCallingProc(procName, listToken) {
	if (listToken.type !== ParseTreeTokenType.LIST)
		throw new Error('listToken must be a list.  Type is ' +
			ParseTreeTokenType.getNameFor(listToken.type) + ' and val = ' + listToken.val);
	const instructions = listToken.children;
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			if (isOutputOrStopToken(instruction))
				return false;
			else if (isAlwaysCallingProcedure(procName, instruction))
				return true;
			else if (mightOutputOrStopBeforeCallingProc(procName, instruction))
				return false;
		}
	}
	return false;
}

function validateForInfiniteRecursion(cachedParseTree, parseLogger) {
	const procedures = cachedParseTree.getProceduresStrictlyFromTree();
	procedures.forEach(function(proc) {
		const startToken = proc.getStartToken();
		if (startToken.children.length > 2 &&
		startToken.children[2].type === ParseTreeTokenType.LIST &&
		isInstructionListAlwaysCallingProc(proc.name.toLowerCase(), startToken.children[2]))
			parseLogger.warn('The ' + proc.name + ' procedure endlessly calls itself creating an infinite loop', startToken);
	});
}

function validateInfiniteForLoops(cachedParseTree, parseLogger) {
	const forTokens = cachedParseTree.getCommandCallsByName('for').filter(function(token) {
		if (token.children.length !== 2)
			return false;
		if (token.children[0].type !== ParseTreeTokenType.LIST || token.children[0].children.length !== 6)
			return false;
		const forControlTokens = token.children[0].children;
		// 3 of the control settings need to be constant numbers for this loop check 
		// to be reasonably simple.
		for (let i = 2; i < 5; i++) {
			if (forControlTokens[i].type !== ParseTreeTokenType.NUMBER_LITERAL)
				return false;
		}
		// look for an output call because that may stop the for-loop early.
		return token.getAllDescendentsAsArray().filter(function(dToken) {
			return CommandCalls.tokenMatchesPrimaryName(dToken, 'output');
		}).length === 0;
	});
	forTokens.forEach(function(forToken) {
		const forControlTokens = forToken.children[0].children;
		const start = forControlTokens[2].val;
		const limit = forControlTokens[3].val;
		const step = forControlTokens[4].val;
		let isInfiniteLoop = true;
		if (limit !== start && step === 0)
			parseLogger.warn('A step of 0 will make this an infinite loop', forControlTokens[4]);
		else if (limit !== start && ((limit > start) !== (step > 0)))
			parseLogger.warn('This will be an infinite loop because the step is going away from the limit.  Consider changing the sign of your step.', forControlTokens[4]);
		else
			isInfiniteLoop = false;
		if (isInfiniteLoop)
			checkTokenInProhibitedProcedure(forToken, parseLogger);
	});
}

export function validateInfiniteLoops(cachedParseTree, parseLogger) {
	validateDoWhileLoops(cachedParseTree, parseLogger);
	validateForeverLoops(cachedParseTree, parseLogger);
	validateForInfiniteRecursion(cachedParseTree, parseLogger);
	validateInfiniteForLoops(cachedParseTree, parseLogger);
	validateInfiniteWhileLoops(cachedParseTree, parseLogger);
};