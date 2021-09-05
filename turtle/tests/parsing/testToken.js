import { Token } from '../../modules/parsing/Token.js';

export function testToken(logger) {
	let token = new Token('fd', 0, 0);
	if (token.isComment())
		logger('fd is not a comment.');
	if (token.isStringLiteral())
		logger('fd is not a string literal.');
	if (token.isVariableReadReference())
		logger('fd is not a variable read reference.');
	if (!token.isCommandName())
		logger('fd is a command name.');
	token.s = '+12';
	if (token.isStringLiteral())
		logger('+12 is not a string literal.');
	if (token.isComment())
		logger('+12 is not a comment.');

	token = new Token('~', 0, 0);
	if (token.isComment())
		logger('~ is not a comment.');
	if (token.isStringLiteral())
		logger('~ is not a string literal.');
	if (token.isVariableReadReference())
		logger('~ is not a variable read reference.');
	if (token.isCommandName())
		logger('~ is not a command name.');
}