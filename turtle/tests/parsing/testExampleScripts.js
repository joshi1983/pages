import { analyzeCodeQuality } from '../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { ArrayUtils } from '../../modules/ArrayUtils.js';
import { compile } from '../../modules/parsing/compile.js';
import { fetchJson } from '../../modules/fetchJson.js';
import { fetchText } from '../../modules/fetchText.js';
import { formatCode } from '../../modules/components/code-editor/format/formatCode.js';
import { getProceduresMap } from '../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { getTestExecuterForCode } from '../helpers/getTestExecuterForCode.js';
import { harmonizeCase } from '../../modules/components/code-editor/harmonize-case/harmonizeCase.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
const examples = await fetchJson('json/scriptExamples.json');
const copyrightenExamples = await fetchJson('tests/data/copyrightenScripts.json');
copyrightenExamples.forEach(function(exampleInfo) {
	exampleInfo.searchKeywords = [];
});
ArrayUtils.pushAll(examples, copyrightenExamples);

function compileCode(code, harmonizeChecked, exampleInfo, logger) {
	const parseLogger = new TestParseLogger(function() {}, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (parseLogger.hasLoggedErrors())
		logger('No parse errors expected but found some.');
	else {
		const proceduresMap = getProceduresMap(tree);
		const initialVariablesMap = new Map();
		analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
		if (parseLogger.hasLoggedErrors())
			logger('No analysis errors expected but some found');
		else if (parseLogger.hasLoggedWarnings())
			logger('No analysis warnings expected but some found');
		else {
			const program = compile(code, tree, parseLogger, new Map(), {'translateToJavaScript': true}, new Map());
			if (parseLogger.hasLoggedErrors())
				logger('No compile errors expected but some found');
			else if (parseLogger.hasLoggedWarnings())
				logger('No analysis warnings expected but some found');
			else if (program.instructions.length === 0 && program.procedures.size === 0)
				logger('No instructions and no procedures found in compiled code for example');
			if (harmonizeChecked === false) {
				const harmonizedCase = harmonizeCase(code, tree);
				if (harmonizedCase !== code)
					logger('harmonizeCase needed for ' + exampleInfo.filename);
				harmonizeChecked = true;
			}
		}
	}
	return parseLogger;
}

function testJSONFormat(logger) {
	const names = new Set();
	examples.forEach(function(exampleInfo, index) {
		if (typeof exampleInfo !== 'object')
			logger('Every example must be an object but it is something else at index ' + index);
		else {
			if (typeof exampleInfo.name !== 'string')
				logger('Every example must have a name but it is missing at index ' + index);
			else if (exampleInfo.name.trim() !== exampleInfo.name)
				logger('Whitespaces should not lead or trail an example name but it is for name: "' + exampleInfo.name + '" at index ' + index);
			else if (names.has(exampleInfo.name))
				logger('The example names must be unique but a duplicate was found of ' + exampleInfo.name + ' at index ' + index);
			else {
				names.add(exampleInfo.name);
				if (!exampleInfo.filename.startsWith('copyrighten')) {
					if (index > 0 && exampleInfo.name.localeCompare(examples[index - 1].name) < 0)
						logger('Script example with name: ' + exampleInfo.name + ' is out of order with its previous example with name: ' + examples[index - 1].name);
				}
			}
			if (typeof exampleInfo.filename !== 'string')
				logger('Every example must have a filename but it is missing at index ' + index);
			if (!(exampleInfo.searchKeywords instanceof Array))
				logger('searchKeywords must be an Array but it is not at index ' + index + ' where the name is ' + exampleInfo.name);
			else {
				exampleInfo.searchKeywords.forEach(function(keyword, kwIndex) {
					if (typeof keyword !== 'string')
						logger('Every element in the searchKeywords Array must be a string but something else was found at index ' + kwIndex + ' in example index ' + index + ' where the name is ' + exampleInfo.name);
				});
			}
		}
	});
}

function testExample(exampleInfo, url, logger) {
	const compileOptionsArray = [
		{'translateToJavaScript': false},
		{'translateToJavaScript': true},
		{'translateToJavaScript': true, 'mergeJavaScriptInstructions': true},
		{'translateToJavaScript': true, 'mergeJavaScriptInstructions': true, 'forProduction': true},
	];
	fetchText(url).then(function(exampleContent) {
		let harmonizeChecked = false;
		const plogger = prefixWrapper(`URL: ${url}`, logger);
		const parseLogger = compileCode(exampleContent, true, exampleInfo, plogger);
		if (!parseLogger.hasLoggedErrorsOrWarnings()) {
			let tree;
			compileOptionsArray.forEach(function(compileOptions) {
				// see if any errors are thrown in the first 1000 instructions.
				const executer = getTestExecuterForCode(exampleContent, plogger, compileOptions);
				executer.addEventListener('exception', function(e) {
					let message = e.details;
					if (typeof message.e === 'object')
						message = message.e;
					if (typeof message.message === 'string')
						message = message.message;
					plogger(`Exception thrown. message=${message}, compileOptions=${JSON.stringify(compileOptions)}`);
				});
				executer.executeInstructionsSync(2000);
				const s = formatCode(exampleContent);
				if (typeof s !== 'string')
					plogger('Expected to get string from formatCode but got ' + s);
				else {
					compileCode(s, harmonizeChecked, exampleInfo, plogger);
					harmonizeChecked = true;
					// we don't want to check this repeatedly for no reason.
				}
			});
		}
	}).catch(function(e) {
		console.error(`url=${url}`,e);
		logger('Error while processing URL: ' + url + '.  The error information is: ' + e);
	});
}

function testCompileAllExamples(logger) {
	examples.forEach(function(exampleInfo) {
		const url = `logo-scripts/${exampleInfo.filename}?${Math.random(1)}`;
		testExample(exampleInfo, url, logger);
	});
}

export function testExampleScripts(logger) {
	testJSONFormat(prefixWrapper('testJSONFormat', logger));
	testCompileAllExamples(prefixWrapper('testCompileAllExamples', logger));
};