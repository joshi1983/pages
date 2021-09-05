import { genericGetApplicableLabelFromGoto } from
'../../../helpers/genericGetApplicableLabelFromGoto.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isAfterOrSame } from
'../../../../generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(getApplicableLabelFromGoto) {
	return function(token) {
		const nameToken = token.children[0];
		if (nameToken === undefined || nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
		nameToken.val.toLowerCase() !== 'goto')
			return false;
		const parent = token.parentNode;
		if (parent.type !== ParseTreeTokenType.CODE_BLOCK)
			return false;
		if (parent.children.indexOf(token) !== 0)
			return false; // this fixer will not handle any instructions before the goto statement.
			// For that reason, return false indicating this fixer is not interested in the token.

		const grandParent = parent.parentNode;
		if (grandParent.type !== ParseTreeTokenType.IF)
			return false;
		
		if (grandParent.children.some(c => c.type === ParseTreeTokenType.ELSE || c.type === ParseTreeTokenType.ELSEIF))
			return false;
			// This fixer does not handle else and elseif clauses correctly so we're not interested in if-statements that contain those.

		const label = getApplicableLabelFromGoto(token);
		if (label === undefined)
			return false;
		if (isAfterOrSame(label, grandParent))
			return false;
		if (label.parentNode !== grandParent.parentNode)
			return false;
			// if the label and grandParent don't share the same parent,
			// it will be too difficult to convert into a do instructions loop while format.
		return true;
	};
}

export function gotoToDoLoopWhile(root) {
	const getApplicableLabelFromGoto = genericGetApplicableLabelFromGoto(root);
	const gotos = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest(getApplicableLabelFromGoto));

	gotos.forEach(function(gotoToken) {
		const ifCodeBlock = gotoToken.parentNode;
		const ifToken = ifCodeBlock.parentNode;
		const thenToken = ifToken.children[1];
		let endIfToken = ifToken.children[3];
		if (endIfToken !== undefined && endIfToken.type !== ParseTreeTokenType.END_IF)
			endIfToken = undefined;
		const label = getApplicableLabelFromGoto(gotoToken);
		const doToken = new ParseTreeToken('DO', label.lineIndex, label.colIndex + 1, ParseTreeTokenType.DO);
		const doCodeBlock = new ParseTreeToken(null, doToken.lineIndex, doToken.colIndex, ParseTreeTokenType.CODE_BLOCK);
		label.appendSibling(doToken);
		
		while (true) {
			const nextSibling = doToken.getNextSibling();
			if (nextSibling === null)
				break; // weird case but we still want to deal with it without throwing an exception.
			if (nextSibling !== ifToken) {
				nextSibling.remove();
				doCodeBlock.appendChild(nextSibling);
			}
			else
				break;
		}
		if (thenToken.type === ParseTreeTokenType.THEN)
			thenToken.remove();
		if (endIfToken !== undefined)
			endIfToken.remove();
		ifToken.remove();
		doToken.appendChild(doCodeBlock);
		ifToken.type = ParseTreeTokenType.WHILE;
		ifToken.val = 'WHILE';
		const loopWhileToken = new ParseTreeToken(null, ifToken.lineIndex, ifToken.colIndex - 1, ParseTreeTokenType.LOOP_WHILE);
		const loopToken = new ParseTreeToken('LOOP', ifToken.lineIndex, ifToken.colIndex - 1, ParseTreeTokenType.LOOP);
		loopWhileToken.appendChild(loopToken);
		loopWhileToken.appendChild(ifToken);
		doToken.appendChild(loopWhileToken);
		
		ifCodeBlock.remove(); // remove the goto and code block.
	});
	return gotos.length !== 0;
};