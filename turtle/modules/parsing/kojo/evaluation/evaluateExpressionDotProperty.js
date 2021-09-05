import { Command } from '../../Command.js';
import { MigrationInfo } from '../MigrationInfo.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function evaluateExpressionDotProperty(token) {
	const children = token.children;
	if (children.length === 3 &&
	children[0].type === ParseTreeTokenType.IDENTIFIER &&
	children[2].type === ParseTreeTokenType.IDENTIFIER) {
		const info = MigrationInfo.getPropertyInfo(token);
		if (info !== undefined) {
			if (info.to !== undefined) {
				const commandInfo = Command.getCommandInfo(info.to);
				if (commandInfo.primaryName === 'pi')
					return Math.PI;
			}
			else if (info.migrateToCode !== undefined) {
				const s = info.migrateToCode.trim();
				if (isNaN(s) === false)
					return parseFloat(s);
			}
		}
	}
};