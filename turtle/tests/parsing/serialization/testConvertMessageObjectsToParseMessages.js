import { BufferedParseLogger } from '../../../modules/parsing/loggers/BufferedParseLogger.js';
import { convertMessageObjectsToParseMessages } from '../../../modules/parsing/serialization/convertMessageObjectsToParseMessages.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
await LogoParser.asyncInit();
await ParseTreeToken.asyncInit();

export function testConvertMessageObjectsToParseMessages(logger) {
	const cases = [
		'fd 10',
		'fd 10\nfd',
		'arcRight 3',
		'arcRight "3',
		'arcRight "3 "9',
		'to p :x\nlocalmake "colo\nend',
		'to\nto p :size\nend\np 100',
		'print 1)',
		'print 3]',
		'print]',
	];
	cases.forEach(function(caseInfo, caseIndex) {
		const code = caseInfo;
		const plogger = prefixWrapper(`Case ${caseIndex}`, logger);
		const parseLogger = new BufferedParseLogger();
		const proceduresMap = new Map();
		const tree = LogoParser.getParseTree(code, parseLogger, proceduresMap);
		const messages = parseLogger._messages;
		const result = convertMessageObjectsToParseMessages(messages, tree);
		if (!(result instanceof Array))
			plogger(`Expected an Array but got ${result}`);
		else if (result.length !== messages.length)
			plogger(`Expected an Array length of ${messages.length} but got ${result.length}`);
		else if (tree !== undefined) {
			/*
			Check that all tokens are found in the tree whenever possible.
			When they are found, we also want them to be the exact same token
			instead of just one of the many matching the colIndex and lineIndex.
			*/
			const treeTokens = ParseTreeToken.flatten(tree);
			result.forEach(function(message, messageIndex) {
				const tokenToFind = message.token;
				const resultIndex = treeTokens.indexOf(tokenToFind);
				const desiredIndex = treeTokens.indexOf(messages[messageIndex].token);
				if (resultIndex !== desiredIndex)
					plogger(`Expected resultIndex to be ${desiredIndex} but got ${resultIndex}.  tokenToFind.val=${tokenToFind.val}`);
			});
		}
	});
}; 