import { analyzeQuality } from '../../../modules/parsing/css/parsing/parse-tree-analysis/validation/analyzeQuality.js';
import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { BufferedParseLogger } from
'../../../modules/parsing/loggers/BufferedParseLogger.js';
import { cssExamples } from '../../helpers/parsing/cssExamples.js';
import { evaluateToken } from '../../../modules/parsing/css/evaluators/evaluateToken.js';
import { fetchText } from '../../../modules/fetchText.js';
import { getDescendentsOfType } from '../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { parse } from '../../../modules/parsing/css/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/css/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

const cssExamples2 = cssExamples.slice();
const linkedCSS = [];
const addedURLSet = new Set();
async function processURL(url) {
	addedURLSet.add(url);
	linkedCSS.push(await fetchText(url));
}
for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
	const url = link.href;
	await processURL(url);
}
await processURL('css/style.css');
// add imported CSS.
for (const content of linkedCSS) {
	const parseResult = parse(content, {});
	const imports = getDescendentsOfType(parseResult.root, ParseTreeTokenType.AT_RULE).filter(t => 
		t.val === '@import' &&
		t.children.length === 1 &&
		t.children[0].type === ParseTreeTokenType.FUNCTION_CALL &&
		t.children[0].children.length === 2);
	for (const importToken of imports) {
		const urlCall = importToken.children[0];
		const urlFuncNameToken = urlCall.children[0];
		const argListToken = urlCall.children[1];
		if (urlFuncNameToken !== undefined &&
		urlFuncNameToken.val === 'url' &&
		argListToken.children.length === 3 &&
		argListToken.children[1].type === ParseTreeTokenType.STRING_LITERAL) {
			let urlString = evaluateToken(argListToken.children[1]);
			if (!urlString.startsWith('https://') && !urlString.startsWith('http://'))
				urlString = 'css/' + urlString;
			await processURL(urlString);
		}
	}
}
ArrayUtils.pushAll(cssExamples2, linkedCSS);

export function testParseVariousExamples(logger) {
	cssExamples2.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}, content=${content}`, logger);
		let settings = {};
		if (content.indexOf('##NO_PARSE_SETTINGS##') !== -1)
			settings = undefined;
		const parseResult = parse(content, settings);
		if (typeof parseResult !== 'object') {
			plogger(`Expected an object but got ${parseResult}`);
		}
		else if (typeof parseResult.root !== 'object') {
			plogger(`Expected parseResult.root to be an object but got ${parseResult.root}`);
		}
		else {
			const parseLogger = new BufferedParseLogger();
			analyzeQuality(parseResult.root, parseLogger);
			if (parseLogger.hasLoggedErrors()) {
				plogger(`No errors expected but some found.  The messages were ${parseLogger.getMessages().map(m => m.msg + 'line ' + m.token.lineIndex).join(',')}`);
			}
		}
	});
};