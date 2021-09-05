import { CommandBoxMessages } from '../CommandBoxMessages.js';
import { tokensToLowerCaseStrings } from './tokensToLowerCaseStrings.js';
import { UnsupportedCommand } from '../../parsing/UnsupportedCommand.js';

export class UnsupportedCommandAction {
	static getUnsupportedCommandFrom(tokens) {
		tokens = tokensToLowerCaseStrings(tokens).filter(function(tokenString) {
			return UnsupportedCommand.getUnsupportedCommandInfo(tokenString) !== undefined;
		});
		return tokens[0];
	}

	matches(tokens) {
		return UnsupportedCommandAction.getUnsupportedCommandFrom(tokens) !== undefined;
	}

	perform(tokens) {
		const commandName = UnsupportedCommandAction.getUnsupportedCommandFrom(tokens);
		const commandInfo = UnsupportedCommand.getUnsupportedCommandInfo(commandName);
		CommandBoxMessages.warn(commandInfo.reason, true);
	}
};