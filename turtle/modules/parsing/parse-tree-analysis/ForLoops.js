import { CommandCalls } from './CommandCalls.js';
import { evaluateToken } from './evaluateToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isDefinitelyInt(token) {
	const val = evaluateToken(token, new Map());
	return Number.isInteger(val);
}

class PrivateForLoops {
	isAForLoopToken(token) {
		if (token === null)
			return false;
		return CommandCalls.tokenMatchesPrimaryName(token, 'for');
	}

	getDataTypeWithForLoop(forToken) {
		if (forToken.children.length === 0)
			return 'num';

		const controlSettingsToken = forToken.children[0];
		const forControlSettings = controlSettingsToken.children;
		if (controlSettingsToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
			if (forControlSettings.length < 2 ||
			forControlSettings[1].children.length < 3)
				return 'num';
			const commandInfo = CommandCalls.getCommandInfo(forControlSettings[1]);
			if (commandInfo === undefined || commandInfo.primaryName !== 'list')
				return 'num';
			const params = forControlSettings[1].children;
			if (params.length < 4)
				return undefined;
			if (isDefinitelyInt(params[1])&&isDefinitelyInt(params[3]))
				return 'int';
		}
		else {
			if (forControlSettings.length < 5)
				return 'num';
			if (forControlSettings.length < 6) {
				if (isDefinitelyInt(forControlSettings[2]))
					return 'int';
				else
					return 'num';
			}
			if (isDefinitelyInt(forControlSettings[2])&&isDefinitelyInt(forControlSettings[4]))
				return 'int';
		}
		return 'num';
	}

	getForLoops(tokens) {
		return CommandCalls.filterCommandCalls(tokens, 'for');
	}

	getInstructionListToken(forToken) {
		if (forToken.children.length === 2) {
			return forToken.children[1];
		}
	}

	getVariableName(forToken) {
		const varNameToken = this.getVariableNameToken(forToken);
		if (varNameToken === undefined)
			return undefined;
		else
			return varNameToken.val.toLowerCase();
	}

	getVariableNameToken(forToken) {
		if (forToken.children.length === 0 || 
		forToken.children[0].children.length < 2)
			return undefined;
		const controlSettingsToken = forToken.children[0];
		if (controlSettingsToken.type === ParseTreeTokenType.LIST) {
			if (typeof controlSettingsToken.children[1].val !== 'string')
				return undefined;
			else
				return controlSettingsToken.children[1];
		}
		else if (controlSettingsToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
			if (controlSettingsToken.children.length < 3 ||
			typeof controlSettingsToken.children[1].val !== 'string' ||
			controlSettingsToken.children[1].children.length < 1 ||
			typeof controlSettingsToken.children[1].children[0].val !== 'string')
				return undefined;

			const commandInfo = CommandCalls.getCommandInfo(controlSettingsToken.children[1]);
			if (commandInfo === undefined || commandInfo.primaryName !== 'list')
				return undefined;
			else// 0: (, 1: "list", 2: "x
				return controlSettingsToken.children[1].children[0];
		}
		else
			return undefined;
	}
};

const ForLoops = new PrivateForLoops();

export { ForLoops };