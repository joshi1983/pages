import { addDeclarationsToProcessOptions } from
'./addDeclarationsToProcessOptions.js';
import { CommentDumpingStringBuffer } from
'../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { harmonizeCase } from
'../../../components/code-editor/harmonize-case/harmonizeCase.js';
import { LogoParser } from
'../../LogoParser.js';
import { LogoScanner } from
'../../LogoScanner.js';
import { ParseLogger } from
'../../loggers/ParseLogger.js';
import { ParseTreeToken } from
'../../ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processComment } from './type-processors/processComment.js';
import { processToken } from
'./type-processors/processToken.js';
import { simplifyJavaScriptCode } from
'./js-simplifiers/simplifyJavaScriptCode.js';
import { simplifyWebLogoCode } from
'./simplifyWebLogoCode.js';

export function translateWebLogoToJS(webLogo, options) {
	if (options === undefined) {
		options = {};
	}
	webLogo = simplifyWebLogoCode(webLogo, options);
	webLogo = harmonizeCase(webLogo);
	const comments = LogoScanner.scan(webLogo).map(t => ParseTreeToken.createFromScannedToken(t, new Set())).
		filter(t => t.type === ParseTreeTokenType.COMMENT);

	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(webLogo, parseLogger, new Map());
	if (tree === undefined)
		throw new Error(`Unable to translate tree because unable to parse the WebLogo code`);

	// remove any procedures not matching procName and that not called from procName's procedure.
	// translate the simplified parse tree to JavaScript.
	const result = new CommentDumpingStringBuffer(comments, processComment);
	const processOptions = {};
	addDeclarationsToProcessOptions(tree, processOptions);
	processToken(tree, result, processOptions);
	result.processAllRemainingComments();
	let jsCode = simplifyJavaScriptCode(result.toString().trim());
	if (options.toModule) {
		jsCode = 'export function run() {\n' + jsCode + '\n};';
	}
	return jsCode;
};