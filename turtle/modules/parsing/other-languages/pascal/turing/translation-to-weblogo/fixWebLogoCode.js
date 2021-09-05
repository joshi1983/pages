import { convertLoopsToForever } from
'../../../../../components/code-editor/code-fixer/fixers/helpers/convertLoopsToForever.js';
import { FixLogger } from
'../../../../../components/code-editor/code-fixer/FixLogger.js';
import { getProceduresMap } from
'../../../../parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../../LogoParser.js';
import { ParseLogger } from
'../../../../loggers/ParseLogger.js';
import { removeTrivialInfiniteLoops } from
'../../../../../components/code-editor/code-fixer/fixers/helpers/removeTrivialInfiniteLoops.js';
import { removeUnneededCurvedBrackets } from
'../../../../../components/code-editor/code-fixer/fixers/helpers/removeUnneededCurvedBrackets.js';
import { removeUnusedAssignments } from
'../../../../../components/code-editor/code-fixer/fixers/removeUnusedAssignments.js';
import { runAllFixers } from
'../../../../../components/code-editor/code-fixer/runAllFixers.js';
import { wrappedFix } from
'../../../../../components/code-editor/code-fixer/wrappedFix.js';

const fixers = [
	convertLoopsToForever,
	removeUnneededCurvedBrackets,
	removeUnusedAssignments,
	removeTrivialInfiniteLoops
];
const fix = runAllFixers(fixers);

export function fixWebLogoCode(code) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined)
		return code;
	const proceduresMap = getProceduresMap(tree);
	const fixLogger = new FixLogger(parseLogger);
	return wrappedFix(code, fix, fixLogger, proceduresMap);
};