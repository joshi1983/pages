import { Command } from '../../../../parsing/Command.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await ParseTreeToken.asyncInit();

const replacements = new Map([
	['color', 'setPenColor'],
	['draw', 'forward'],
	['move', 'jumpForward'],
	['thick', 'setPenSize'],
	['let', 'make']
]);

const webTurtleNames = new Set(replacements.keys());
webTurtleNames.add('go');
webTurtleNames.add('end');

const unsafeChildTypes = new Set([
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.PROCEDURE_START_KEYWORD,
	ParseTreeTokenType.PROCEDURE_END_KEYWORD
]);

function isSafeToAddAsChild(token) {
	if (token === null || unsafeChildTypes.has(token.type))
		return false;
	if (token.val === ']' || token.val === '[')
		return false;
	return true;
}

function quoteVarNameInMake(cachedParseTree, callToken, fixLogger) {
	if (callToken.children.length === 0 || callToken.val !== 'make')
		return; // can't quote it if callToken isn't calling make or there is no variable name.
	const firstChild = callToken.children[0];
	if (firstChild.type === ParseTreeTokenType.LEAF) {
		firstChild.type = ParseTreeTokenType.STRING_LITERAL;
		cachedParseTree.tokenTypeChanged(firstChild, ParseTreeTokenType.LEAF);
		fixLogger.log(`Quoted string literal for variable name "${firstChild.val} because the variable name input to make is a string literal.`, firstChild);
	}
}

function processEnd(cachedParseTree, callToken, fixLogger) {
	if (callToken.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return; // nothing to fix.

	callToken.remove();
	cachedParseTree.tokenRemoved(callToken);
	fixLogger.log(`Removed ${callToken.val} because WebLogo uses 'end' only to indicate the end of procedures`, callToken);
}

export function webTurtleCommandFixer(cachedParseTree, fixLogger) {
	const commandCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(token => webTurtleNames.has(token.val.toLowerCase()));
	if (commandCalls.length > 3) {
		const commandNameSet = new Set(commandCalls.map(token => token.val.toLowerCase()));
		if (commandNameSet.size < 2)
			return;
			/*
			We're not confident enough of the code belonging to WebTurtle to 
			make changes in this fixer so stop.
			We want to avoid mistakenly replacing commands like 'end', 'let' and 'color' as if it 
			were WebTurtle when these could be used in different ways by other Logo interpreters.
			*/
		commandCalls.forEach(function(callToken) {
			if (callToken.val.toLowerCase() === 'go') {
				callToken.remove();
				cachedParseTree.tokenRemoved(callToken);
				fixLogger.log(`Removed ${callToken.val} because go is not used in WebLogo.  WebLogo calls procedures by procedure name and nothing before it.`, callToken);
			}
			else if (callToken.val.toLowerCase() === 'end') {
				processEnd(cachedParseTree, callToken, fixLogger);
			}
			else {
				const oldValue = callToken.val;
				callToken.val = replacements.get(callToken.val.toLowerCase());
				callToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
				
				// simulate what createParameterizedGroups does while parsing by
				// adding the child tokens.
				const commandInfo = Command.getCommandInfo(callToken.val);
				const argCount = Command.getArgCount(commandInfo);
				while (isSafeToAddAsChild(callToken.nextSibling) && argCount.defaultCount > callToken.children.length) {
					const nextSibling = callToken.nextSibling;
					nextSibling.remove();
					callToken.appendChild(nextSibling);
				}
				quoteVarNameInMake(cachedParseTree, callToken, fixLogger);

				cachedParseTree.tokenValueChanged(callToken, oldValue);
				cachedParseTree.tokenTypeChanged(callToken, ParseTreeTokenType.LEAF);
				fixLogger.log(`Replaced ${oldValue} with ${callToken.val} because that is the best corresponding command in WebLogo.`, callToken);
			}
		});
	}
};