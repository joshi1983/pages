import { fixCode } from '../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from '../../components/code-editor/code-fixer/FixLogger.js';
import { fixWebLogoCodeFromPython } from './new-translation-to-weblogo/fixWebLogoCodeFromPython.js';
import { formatCode } from '../../components/code-editor/format/formatCode.js';
import { parse } from './parsing/parse.js';
import { ParseLogger } from '../loggers/ParseLogger.js';
import { removeTrivialInfiniteLoops } from
'../../components/code-editor/code-fixer/fixers/helpers/removeTrivialInfiniteLoops.js';
import { simplifyParseTree } from './new-translation-to-weblogo/parse-tree-simplifiers/simplifyParseTree.js';
import { tokenToWebLogoCode } from './new-translation-to-weblogo/tokenToWebLogoCode.js';

const extraFixers = [
	removeTrivialInfiniteLoops
];

/*
The caller must ensure that python-parsing/parser.js's asyncInit() promise is resolved before calling.
*/
export function newTranslatePythonCodeToWebLogo(pythonCode) {
	const parseResult = parse(pythonCode);
	const parseLogger = new ParseLogger();
	const fixLogger = new FixLogger(parseLogger);
	simplifyParseTree(parseResult.root);
	let webLogoCode = formatCode(tokenToWebLogoCode(parseResult.root, parseResult.comments, true));
	const proceduresMap = new Map();
	const webLogoParseTree = undefined;
	webLogoCode = fixCode(webLogoCode, fixLogger, proceduresMap, webLogoParseTree, extraFixers);
	return formatCode(fixWebLogoCodeFromPython(webLogoCode));
};