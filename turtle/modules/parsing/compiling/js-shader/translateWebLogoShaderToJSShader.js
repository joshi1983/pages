import { Command } from
'../../Command.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { getProceduresMap } from
'../../parse-tree-analysis/getProceduresMap.js';
import { harmonizeCase } from
'../../../components/code-editor/harmonize-case/harmonizeCase.js';
import { isAfterOrSame } from
'../../generic-parsing-utilities/isAfterOrSame.js';
import { LogoParser } from
'../../LogoParser.js';
import { LogoScanner } from
'../../LogoScanner.js';
import { ParseLogger } from
'../../loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from
'../../parseTreeToCodeWithComments.js';
import { ParseTreeToken } from
'../../ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { translateWebLogoToJS } from
'../to-js/translateWebLogoToJS.js';

function removeUnneededGlobalInstructions(root, matchedProc) {
	// remove any global variables not used by the specified procedure.
	// remove any global procedure calls that can be easily be removed.
	for (let i = root.children.length - 1; i >= 0; i--) {
		const child = root.children[i];
		if (child.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
			child.remove();
		}
	}
}

function removeUnneededProcedures(root, matchedProc, comments) {
	const namesNotToRemove = new Set([matchedProc.name]);
	const requiredProcedures = new Set([matchedProc]);
	let procsToCheck = Array.from(requiredProcedures);
	let continueLooking = true;
	const proceduresMap = getProceduresMap(root);
	while (continueLooking) {
		continueLooking = false;
		const newProcsToCheck = new Set();
		// look for procedures that are directly or 
		// indirectly called b the matchedProc.
		for (const proc of procsToCheck) { 
			const directProcCalls = getDescendentsOfType(proc.getStartToken(),
				ParseTreeTokenType.PARAMETERIZED_GROUP).
				filter(t => Command.getCommandInfo(t.val) === undefined &&
					!namesNotToRemove.has(t.val.toLowerCase()));
			if (directProcCalls.length !== 0) {
				continueLooking = true;
				for (const call of directProcCalls) {
					namesNotToRemove.add(call.val.toLowerCase());
					const proc = proceduresMap.get(call.val.toLowerCase());
					if (proc !== undefined)
						newProcsToCheck.add(proc);
				}
			}
		}
		procsToCheck = newProcsToCheck;
	}
	for (let i = 0; i < root.children.length; i++) {
		const child = root.children[i];
		if (child.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
		child.children.length !== 0) {
			const nameToken = child.children[0];
			if (typeof nameToken.val === 'string' &&
			!namesNotToRemove.has(nameToken.val.toLowerCase())) {
				const lastChild = child.children[child.children.length - 1];
				child.remove();

				// remove comments that are likely associated with code in the removed procedure.
				let removeStartIndex = undefined, removeCount = 0;
				for (let i = 0; i < comments.length; i++) {
					const comment = comments[i];
					if (isAfterOrSame(comment, child) &&
					isAfterOrSame(lastChild, comment)) {
						if (removeStartIndex === undefined)
							removeStartIndex = i;
						removeCount++;
					}
				}
				if (removeStartIndex !== undefined)
					comments.splice(removeStartIndex, removeCount);
			}
		}
	}
}

export function translateWebLogoShaderToJSShader(webLogo, procName) {
	webLogo = harmonizeCase(webLogo);
	const comments = LogoScanner.scan(webLogo).map(t => ParseTreeToken.createFromScannedToken(t, new Set())).
		filter(t => t.type === ParseTreeTokenType.COMMENT);
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(webLogo, parseLogger, new Map());
	if (tree === undefined)
		throw new Error(`Unable to translate tree because unable to parse the WebLogo code`);

	const proceduresMap = getProceduresMap(tree);
	const matchedProc = proceduresMap.get(procName);
	if (matchedProc === undefined)
		throw new Error(`Unable to translate because unable to find procedure named ${procName}`);

	removeUnneededGlobalInstructions(tree, matchedProc);
	removeUnneededProcedures(tree, matchedProc, comments);
	webLogo = parseTreeToCodeWithComments(tree, webLogo);

	return translateWebLogoToJS(webLogo);
};