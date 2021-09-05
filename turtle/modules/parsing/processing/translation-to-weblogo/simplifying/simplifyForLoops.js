import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from '../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function addMissingClosingBracketsToForLoopSettings(forToken) {
	const forLoopSettings = forToken.children[0];
	if (forLoopSettings !== undefined && forLoopSettings.type === ParseTreeTokenType.FOR_LOOP_SETTINGS) {
		const children = forLoopSettings.children;
		const first = children[0];
		const last = children[children.length - 1];
		if (first === undefined || first.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET) {
			forLoopSettings.insertAsFirstChild(new ParseTreeToken('(',
				forLoopSettings.lineIndex, forLoopSettings.colIndex, ParseTreeTokenType.CURVED_LEFT_BRACKET));
		}
		if (last === undefined || last.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
			let lastPos = last;
			if (lastPos === undefined)
				lastPos = forLoopSettings;
			forLoopSettings.appendChild(new ParseTreeToken(')',
				lastPos.lineIndex, lastPos.colIndex, ParseTreeTokenType.CURVED_RIGHT_BRACKET));
		}
	}
}

function removeSemicolon(forSettings) {
	const children = forSettings.children;
	for (let i = 1; i < children.length; i++) {
		const tok = children[i];
		if (tok.type === ParseTreeTokenType.SEMICOLON) {
			const prev = children[i - 1];
			if (prev.type === ParseTreeTokenType.SEMICOLON) {
				tok.remove();
				return true;
			}
		}
	}
	return false;
}

function insertSemicolon(forLoopSettings) {
	const children = forLoopSettings.children;
	const last = children[children.length - 1];
	const newSemicolonToken = new ParseTreeToken(';',
		forLoopSettings.lineIndex, forLoopSettings.colIndex, ParseTreeTokenType.SEMICOLON);
	if (children.length === 0)
		forLoopSettings.insertAsFirstChild(newSemicolonToken);
	else if (last.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
		last.appendPreviousSibling(newSemicolonToken);
	}
	else {
		const first = children[0];
		if (first.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
			first.appendSibling(newSemicolonToken);
		else
			forLoopSettings.insertAsFirstChild(newSemicolonToken);
	}
}

function sanitizeSemicolonsInForLoopSettings(forToken) {
	const forLoopSettings = forToken.children[0];
	if (forLoopSettings !== undefined) {
		const semicolons = forLoopSettings.children.filter(t => t.type === ParseTreeTokenType.SEMICOLON);
		if (semicolons.length !== 2 && semicolons.length !== 0) {
			if (semicolons.length > 2) {
				for (let i = semicolons.length; i > 2; i--) {
					if (!removeSemicolon(forLoopSettings))
						break;
				}
			}
			else {
				for (let i = semicolons.length; i < 2; i++) {
					insertSemicolon(forLoopSettings);
				}
			}
		}
	}
}

export function simplifyForLoops(root) {
	const fors = getDescendentsOfType(root, ParseTreeTokenType.FOR);
	for (const forToken of fors) {
		addMissingClosingBracketsToForLoopSettings(forToken);
		sanitizeSemicolonsInForLoopSettings(forToken);
	}
};