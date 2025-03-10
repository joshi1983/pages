import { ArrayUtils } from '../../../../../ArrayUtils.js';
import { fixOperatorPrecedence } from '../../../../../parsing/fixOperatorPrecedence.js';
import { getAllDescendentsAsArray } from
'../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getArgCount } from '../../../../../parsing/generic-parsing-utilities/getArgCount.js';
import { getRootForParseTreeToken } from
'../../../../../parsing/parse-tree-token/getRootForParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
import { processConvertToUnaryOperator } from './processConvertToUnaryOperator.js';
import { processLogoMigrationOperatorsClashingWithCommands } from './processLogoMigrationOperatorsClashingWithCommands.js';
import { processMigrateToCode } from './processMigrateToCode.js';
import { processOperatorChildrenIfPossible } from './processOperatorChildrenIfPossible.js';
import { processOperatorToCommand } from './processOperatorToCommand.js';
import { processRemoveCallTokenOnly } from './processRemoveCallTokenOnly.js';
import { processWebLogoCommandRename } from './processWebLogoCommandRename.js';
import { renameParameterizedGroupToken } from './renameParameterizedGroupToken.js';
import { sanitizeForLogoMigration } from './sanitization/sanitizeForLogoMigration.js';

function isOfInterest(commandNames, operatorsMap, commandsToRemove) {
	return function(token) {
		const val = token.val.toLowerCase();
		return commandNames.has(val) || operatorsMap.has(val) || commandsToRemove.has(val);
	};
}

function removeCall(cachedParseTree, token, migrationCommandInfo, fixLogger) {
	const numArgs = getArgCount(migrationCommandInfo, token);
	const tokenParent = token.parentNode;
	let shouldRemoveParent = false;
	if (migrationCommandInfo.argCount !== undefined &&
	tokenParent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		shouldRemoveParent = true;
	}
	const removed = [];
	let tok = token;
	for (let i = 0; tok !== null && i <= numArgs; i++) {
		const next = tok.nextSibling;
		ArrayUtils.pushAll(removed, getAllDescendentsAsArray(tok));
		tok.remove();
		removed.push(tok);
		tok = next;
	}
	if (shouldRemoveParent) {
		tokenParent.remove();
		for (const bracketToken of tokenParent.children) {
			bracketToken.remove();
			removed.push(bracketToken);
		}
		removed.push(tokenParent);
	}
	fixLogger.log(`Removed call to ${removed[0].val} because it is not supported in WebLogo`, token);
	cachedParseTree.tokensRemoved(removed);
}

export function processLogoMigration(cachedParseTree, fixLogger, info) {
	const commandsToRemove = new Map();
	const commandNames = new Map();
	info.commands.forEach(function(commandInfo) {
		if (commandInfo.removeInMigration === true) {
			commandsToRemove.set(commandInfo.primaryName.toLowerCase(), commandInfo);
			if (commandInfo.names instanceof Array) {
				commandInfo.names.forEach(function(name) {
					commandsToRemove.set(name.toLowerCase(), commandInfo);
				});
			}
		}
		if (commandInfo.to === undefined)
			return;
		if (commandInfo.primaryName.toLowerCase() !== commandInfo.to.toLowerCase())
			commandNames.set(commandInfo.primaryName.toLowerCase(), commandInfo.to);
		if (commandInfo.names instanceof Array) {
			commandInfo.names.forEach(function(name) {
				name = name.toLowerCase();
				if (name !== commandInfo.to.toLowerCase()) {
					commandNames.set(name, commandInfo.to);
				}
			});
		}
	});
	const operatorsMap = new Map();
	let isFixOperatorPrecedenceImportant = false;
	if (info.operators instanceof Array) {
		info.operators.forEach(function(operatorInfo) {
			if (operatorInfo.to === undefined || operatorInfo.to === operatorInfo.symbol)
				return;
			operatorsMap.set(operatorInfo.symbol, operatorInfo.to);
		});
	}
	const tokensOfInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest(commandNames, operatorsMap, commandsToRemove));
	tokensOfInterest.forEach(function(token, index) {
		// Check that the token is still part of the tree.
		// Mutations within this loop can remove some tokensOfInterest.
		if (getRootForParseTreeToken(token).type !== ParseTreeTokenType.TREE_ROOT)
			return;
		const oldVal = token.val;
		const to = commandNames.get(token.val.toLowerCase());
		if (to !== undefined) {
			renameParameterizedGroupToken(cachedParseTree, token, oldVal, to, undefined, fixLogger, undefined);
		}
		else if (commandsToRemove.has(token.val.toLowerCase())) {
			removeCall(cachedParseTree, token, commandsToRemove.get(token.val.toLowerCase()), fixLogger);
		}
		else {
			const oldType = token.type;
			const to = operatorsMap.get(token.val.toLowerCase());
			token.val = to;
			token.type = ParseTreeTokenType.BINARY_OPERATOR;
			processOperatorChildrenIfPossible(token);
			fixLogger.log(`Replaced ${oldVal} with ${token.val} because ${oldVal} is not supported in WebLogo`, token);
			if (oldType !== ParseTreeTokenType.BINARY_OPERATOR)
				cachedParseTree.tokenTypeChanged(token, oldType);
			isFixOperatorPrecedenceImportant = true;
		}
	});
	processConvertToUnaryOperator(cachedParseTree, fixLogger, info);
	processOperatorToCommand(cachedParseTree, fixLogger, info);
	processWebLogoCommandRename(cachedParseTree, fixLogger, info);
	processLogoMigrationOperatorsClashingWithCommands(cachedParseTree, fixLogger, info);
	processMigrateToCode(cachedParseTree, fixLogger, info);
	processRemoveCallTokenOnly(cachedParseTree, fixLogger, info);
	sanitizeForLogoMigration(cachedParseTree, fixLogger, info);
	if (isFixOperatorPrecedenceImportant) {
		fixOperatorPrecedence(cachedParseTree.root);
	}
};