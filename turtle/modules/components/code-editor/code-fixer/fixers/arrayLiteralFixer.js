import { getNextArgToken } from
'./helpers/getNextArgToken.js';
import { getParseTokensSorted } from
'../../../../parsing/parse-tree-token/getParseTokensSorted.js';
import { convertLeafToStringLiteral } from
	'./leafsInDataListsToStringLiteralsFixer.js';
import { isOriginString } from
'../../../../parsing/fms-logo/scan.js';
import { ParseTreeToken } from
'../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';

const giveupTypes = new Set([
	ParseTreeTokenType.PROCEDURE_END_KEYWORD,
	ParseTreeTokenType.PROCEDURE_START_KEYWORD
]);

const replacements = new Map([
	['{', '['],
	['}', ']'],
]);

function tryRestructuringListLiteral(token, cachedParseTree, fixLogger) {
	if (token.val !== '[')
		return;
	const newChildren = [];
	let tok = token;
	while (tok !== null) {
		if (giveupTypes.has(tok.type))
			return;
		if (tok.type === ParseTreeTokenType.LEAF) {
			if (tok.val === '(' || tok.val === ')')
				return; // give up in this case too.
				// If a curved bracket expression is structured properly,
				// we should find a CURVED_BRACKET_EXPRESSION token instead of a bracket.
				// Finding a bracket is a sign that restructuring can turn some 
				// weirdness into more weirdness.
				// Give up to keep things simpler to troubleshoot and less likely to introduce more bugs.
			if (newChildren.length !== 0 &&
			(tok.val === '{' || tok.val === '['))
				return; // give up because that's weird.
				// '[' is expected at the beginning but nowhere else in our argument list.
		}
		newChildren.push(tok);
		if ((tok.val === '}' || tok.val === ']') &&
		!tok.isStringLiteral()) {
			const next = tok.nextSibling;
			if (next !== null && next.type === ParseTreeTokenType.LEAF &&
			next.colIndex === tok.colIndex + next.val.length &&
			next.lineIndex === tok.lineIndex &&
			isOriginString(next.val)) {
				// remove FMSLogo's origin indicator that 
				// comes after the closing } bracket in some array literals.
				next.remove();
				cachedParseTree.tokenRemoved(next);
			}
			break;
		}
		tok = getNextArgToken(tok, true);
	}
	if (token !== null) {
		const parent = token.parentNode;
		const newList = new ParseTreeToken(null, null, token.lineIndex, token.colIndex,
			ParseTreeTokenType.LIST);
		parent.replaceChild(token, newList);
		cachedParseTree.tokenAdded(newList);
		for (const child of newChildren) {
			child.remove();
			newList.appendChild(child);
			if (!child.isBracket() && child.type === ParseTreeTokenType.LEAF)
				convertLeafToStringLiteral(cachedParseTree, fixLogger)(child);
		}
	}
}

function isOfInterest(token) {
	if (!replacements.has(token.val) &&
	!(token.val[0] === '}' && isOriginString(token.val.substring(1))))
		return false;
	return true;
}

export function arrayLiteralFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	getParseTokensSorted(tokens);
	tokens.reverse();
	tokens.forEach(function(token) {
		const oldVal = token.val;
		if (replacements.has(oldVal))
			token.val = replacements.get(oldVal);
		else
			token.val = ']';
		cachedParseTree.tokenValueChanged(token, oldVal);
		tryRestructuringListLiteral(token, cachedParseTree, fixLogger);

		fixLogger.log(`Replaced ${oldVal} with ${token.val} because WebLogo supports lists instead of arrays.  ` +
		`There is no exclusive type for arrays in WebLogo like there is in some other versions of Logo.`, token);
	});
};