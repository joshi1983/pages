import { fixCode } from '../../components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from '../../components/code-editor/code-fixer/FixLogger.js';
import { formatCode } from '../../components/code-editor/format/formatCode.js';
import { getSingleLineCommentsFromCode } from './parse-tree-conversion/getSingleLineCommentsFromCode.js';
import { asyncInit as parseAsyncInit, parse } from './parse.js';
import { ParseLogger } from '../loggers/ParseLogger.js';
import { asyncInit as tokenToWebLogoAsyncInit, tokenToWebLogoCode } from './translation-to-weblogo/tokenToWebLogoCode.js';

async function init() {
	await parseAsyncInit();
	await tokenToWebLogoAsyncInit();
}

const initPromise = init();

export function asyncInit() {
	return initPromise;
}

/*
The caller must ensure that python-parsing/parser.js's asyncInit() promise is resolved before calling.
*/
export function translatePythonCodeToWebLogo(pythonCode) {
	const tree = parse(pythonCode);
	const comments = getSingleLineCommentsFromCode(pythonCode);
	const parseLogger = new ParseLogger();
	const fixLogger = new FixLogger(parseLogger);
	let webLogoCode = tokenToWebLogoCode(tree, comments, true);
	const proceduresMap = new Map();
	const webLogoParseTree = undefined;
	webLogoCode = fixCode(webLogoCode, fixLogger, proceduresMap, webLogoParseTree);
	return formatCode(webLogoCode);
};