import { ArrayUtils } from
'../../../../../ArrayUtils.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { StringType } from
'../../../../../parsing/data-types/StringType.js';

const strType = new StringType();

function isOfInterest(token) {
	return token.val.toLowerCase() === 'setfont';
}

function getGoodArgCount(token) {
	const parent = token.parentNode;
	let result = 3;
	if (parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		if (parent.children.indexOf(token) === 1)
			result = parent.children.filter(t => !t.isBracket()).length - 1;
	}
	return result;
}

export function setFontFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	tokens.forEach(function(token) {
		const oldVal = token.val;
		const argCount = getGoodArgCount(token);
		const parent = token.parentNode;
		const next = token.nextSibling;
		if (argCount === 0) {
			const toRemove = [];
			if (parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
				ArrayUtils.pushAll(toRemove, parent.children);
				toRemove.push(parent);
			}
			else
				toRemove.push(token);
			toRemove.forEach(t => t.remove());
			cachedParseTree.tokensRemoved(toRemove);
			fixLogger.log(`Removed setFont because it did nothing.`, token);
			return;
		}
		else if (argCount === 1) {
			if (next === null || !strType.mayBeCompatibleWith(next))
				return;

			next.remove();
			token.val = 'setFontFamily';
			token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
			token.appendChild(next);
			cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
			fixLogger.log(`Renamed ${oldVal} to setFontFamily because that is what WebLogo supports.`, token);
		}
		else if (argCount === 2) {
			const nextNext = next.nextSibling;
			if (nextNext === null)
				return;
			token.val = 'setFontFamilyAndSize';
			token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
			cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
			next.remove();
			nextNext.remove();
			token.appendChild(next);
			token.appendChild(nextNext);
			fixLogger.log(`Renamed ${oldVal} to setFontFamilyAndSize because setFont is not supported in WebLogo.`, token);
		}
		else if (argCount === 3) {
			const args = [next];
			let t = next.nextSibling;
			for (let i = 0; t !== null && i < 2; i++) {
				args.push(t);
				t = t.nextSibling;
			}
			token.val = 'setFont3';
			token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
			cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
			for (const arg of args) {
				arg.remove();
				token.appendChild(arg);
			}
			fixLogger.log(`Renamed ${oldVal} to setFont3 because setFont is not supported in WebLogo.`, token);
		}
		if (parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
			const toRemove = parent.children.filter(t => t.isBracket());
			toRemove.push(parent);
			token.remove();
			parent.parentNode.replaceChild(parent, token);
			toRemove.forEach(t => t.remove());
			cachedParseTree.tokensRemoved(toRemove);
		}
	});
};