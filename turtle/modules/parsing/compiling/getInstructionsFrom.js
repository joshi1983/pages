import { addInstructionsForSpecialCommand } from './addInstructionsForSpecialCommand.js';
import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { CallProcedureInstruction } from '../execution/instructions/CallProcedureInstruction.js';
import { Command } from '../Command.js';
import { isAcceptableInstructionListChild } from '../parse-tree-analysis/isAcceptableInstructionListChild.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { ParseTreeToken } from '../ParseTreeToken.js';
import { PopInstruction } from '../execution/instructions/PopInstruction.js';
import { pushParameters } from './compileParameters.js';
await Command.asyncInit();

export function getInstructionsFrom(parseTreeTokens, procedures, logger, result, isPoppingResults) {
	if (isPoppingResults === undefined)
		isPoppingResults = true;
	if (typeof isPoppingResults !== 'boolean')
		throw new Error('Either undefined or a boolean value expected for isPoppingResults');
	if (!(procedures instanceof Map))
		throw new Error('procedures must be a Map');
	if (parseTreeTokens instanceof ParseTreeToken)
		parseTreeTokens = [parseTreeTokens];
	if (parseTreeTokens instanceof Array && parseTreeTokens.length === 1 && parseTreeTokens[0].type === ParseTreeTokenType.TREE_ROOT)
		parseTreeTokens = parseTreeTokens[0].children;
	if (!(result instanceof Array))
		throw new Error('result must be an Array or a ParseTreeToken');

	for (var i = 0; i < parseTreeTokens.length; i++) {
		let token = parseTreeTokens[i];
		if (token.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
			if (isAcceptableInstructionListChild(token)) {
				token = token.children[1];
			}
			if (token.type !== ParseTreeTokenType.LEAF &&
			token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP) {
				logger.error('Command or procedure expected', token);
				return result;
			}
			const commandInfo = Command.getCommandInfo(token.val);
			let newInstruction = undefined;
			if (commandInfo === undefined) {
				const proc = procedures.get(token.val.toLowerCase());
				if (proc !== undefined) {
					pushParameters(token.children, procedures, result, logger);
					newInstruction = new CallProcedureInstruction(proc, token);
					if (isPoppingResults) {
						result.push(newInstruction);
						newInstruction = new PopInstruction(token);
					}
				}
				else {
					logger.error("I don't know how to " + token.val, token);
					if (logger.hasReachedErrorLimit())
						return result;
				}
			}
			else if (!addInstructionsForSpecialCommand(token, commandInfo, procedures, result, logger)) {
				pushParameters(token.children, procedures, result, logger);
				newInstruction = new CallCommandInstruction(commandInfo, Command.getArgCount(commandInfo).defaultCount, token);
				if (isPoppingResults) {
					result.push(newInstruction);
					newInstruction = new PopInstruction(token);
				}
			}
			if (newInstruction !== undefined)
				result.push(newInstruction);
		}
	}
};