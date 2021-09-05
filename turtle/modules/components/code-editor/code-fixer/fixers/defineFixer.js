import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

/*
This fixer is focused on procedure definitions from an interpreter that defines procedures like:

Define "box [ [size] [ repeat 4 [forward :size right 90] ]
*/

function removeListBrackets(listToken, logger, cachedParseTree) {
	let isRemoved = false;
	for (let i = 0; i < listToken.children.length; i++) {
		const tok = listToken.children[i];
		if (tok.type === ParseTreeTokenType.LEAF && (tok.val === '[' || tok.val === ']')) {
			tok.parentNode.removeChild(tok);
			cachedParseTree.tokenRemoved(tok);
			isRemoved = true;
		}
	}
	if (isRemoved) {
		logger.log('Removed square brackets for list since WebLogo does not expect them used in a procedure definition like this', listToken);
	}
}

function isEndTokenFound(listToken) {
	const tokens = listToken.getAllDescendentsAsArray();
	for (let i = 0; i < tokens.length; i++) {
		const tok = tokens[i];
		if (typeof tok.val === 'string' && 
		tok.val.toLowerCase() === 'end' &&
		[ParseTreeTokenType.LEAF, ParseTreeTokenType.PROCEDURE_END_KEYWORD].indexOf(tok.type) !== -1)
			return true;
	}
}

export function defineFixer(cachedParseTree, logger) {
	const defineTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(function(token) {
			return token.val.toLowerCase() === 'define'
		});
	defineTokens.forEach(function(defineToken) {
		const previousVal = defineToken.val;
		defineToken.val = 'to';
		cachedParseTree.tokenValueChanged(defineToken, previousVal);
		logger.log('Replaced unsupported "define" with "to"', defineToken);
		if (defineToken.nextSibling !== null && defineToken.nextSibling.type === ParseTreeTokenType.STRING_LITERAL) {
			// assume it is a procedure name.
			const nameToken = defineToken.nextSibling;
			nameToken.type = ParseTreeTokenType.LEAF;
			cachedParseTree.tokenTypeChanged(nameToken, ParseTreeTokenType.STRING_LITERAL);
			logger.log(`Removed quote before procedure name "${nameToken.val}" since WebLogo does not expect procedure names to have quotes`, nameToken);
			if (nameToken.nextSibling !== null && nameToken.nextSibling.type === ParseTreeTokenType.LIST) {
				const listToken = nameToken.nextSibling;
				if (listToken.children.length > 3) {
					// Very likely, listToken represents both the parameters and instructions for the procedure.
					const paramListToken = listToken.children[1];
					if (paramListToken.children.length >= 2) {
						const lastParamToken = paramListToken.children[paramListToken.children.length - 1];
						const lastInstructionToken = listToken.children[listToken.children.length - 1];

						removeListBrackets(listToken, logger, cachedParseTree);
						removeListBrackets(paramListToken, logger, cachedParseTree);
						const instructionListToken = listToken.children[listToken.children.length - 1];

						for (let i = 0; i < paramListToken.children.length; i++) {
							const paramToken = paramListToken.children[i];
							if (paramToken.type === ParseTreeTokenType.LEAF) {
								paramToken.type = ParseTreeTokenType.VARIABLE_READ;
								cachedParseTree.tokenTypeChanged(paramToken, ParseTreeTokenType.LEAF);
								logger.log(`Added : before parameter "${paramToken.val}" because that is needed to indicate WebLogo procedure parameters`, paramToken);
							}
						}
						// add a new line at the end of the parameter list.
						const newLineToken = new ParseTreeToken('\n', null, lastParamToken.lineIndex, lastParamToken.colIndex + 1, ParseTreeTokenType.LEAF);
						paramListToken.appendSibling(newLineToken);
						cachedParseTree.tokenAdded(newLineToken);
						if (!isEndTokenFound(listToken)) {
							const endToken = new ParseTreeToken("end", null, lastInstructionToken.lineIndex, lastInstructionToken.colIndex + 1, ParseTreeTokenType.PROCEDURE_END_KEYWORD);
							listToken.appendChild(endToken);
							cachedParseTree.tokenAdded(endToken);
							logger.log(`Added the end keyword to mark the end of your "${nameToken.val}" procedure`, endToken);
						}
						if (instructionListToken.type === ParseTreeTokenType.LIST) {
							removeListBrackets(instructionListToken, logger, cachedParseTree);
						}
						defineToken.type = ParseTreeTokenType.PROCEDURE_START_KEYWORD;
						cachedParseTree.tokenTypeChanged(defineToken, ParseTreeTokenType.LEAF);
					}
				}
			}
		}
	});
};