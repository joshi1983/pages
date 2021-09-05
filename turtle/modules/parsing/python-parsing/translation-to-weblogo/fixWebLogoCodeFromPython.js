import { BufferedParseLogger } from
'../../loggers/BufferedParseLogger.js';
import { FixLogger } from
'../../../components/code-editor/code-fixer/FixLogger.js';
import { getProceduresMap } from
'../../parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../LogoParser.js';
import { removeUnstartedPolyEndFixer } from
'../../../components/code-editor/code-fixer/fixers/removeUnstartedPolyEndFixer.js';
import { removeUnusedParameters } from
'../../../components/code-editor/code-fixer/fixers/helpers/removeUnusedParameters.js';
import { runAllFixers } from
'../../../components/code-editor/code-fixer/runAllFixers.js';
import { wrappedFix } from '../../../components/code-editor/code-fixer/wrappedFix.js';

const runAllFixers_ = runAllFixers([
	removeUnstartedPolyEndFixer,
	removeUnusedParameters
]);

/*
Runs some fixers specific to WebLogo code that was made from Python.
*/
export function fixWebLogoCodeFromPython(code) {
	const tempParseLogger = new BufferedParseLogger();
	let tree = LogoParser.getParseTree(code, tempParseLogger);
	if (tree === undefined)
		return code; // the code is unfixable if it can't be parsed.
	const proceduresMap = getProceduresMap(tree);
	const fixLogger = new FixLogger(tempParseLogger);
	code = wrappedFix(code, runAllFixers_, fixLogger, proceduresMap, tree);
	return code;
};