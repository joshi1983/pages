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
import { ProgressIndicator } from '../helpers/ProgressIndicator.js';
import { SetUtils } from '../../modules/SetUtils.js';
import { sleep } from '../helpers/sleep.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';
import { validateVector2DDrawing } from '../helpers/drawing/vector/validateVector2DDrawing.js';
const examples = await fetchJson('json/scriptExamples.json');
const copyrightenExamples = await fetchJson('tests/data/copyrightenScripts.json');
copyrightenExamples.forEach(function(exampleInfo) {
	exampleInfo.searchKeywords = [];
});
ArrayUtils.pushAll(examples, copyrightenExamples);

function validateExampleCodeBasic(code, logger) {
	if (code.indexOf('\'local://') !== -1)
		logger(`Did not expect to find 'local:// in code.  Did you forget to remove a reference to an asset that is unlikely to be stored for everyone looking at examples?`);
}

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
		else if (parseLogger.hasLoggedTips())
			logger('No analysis tips expected but some found');
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
			if (exampleInfo.hiddenKeywords !== undefined) {
				if (!(exampleInfo.hiddenKeywords instanceof Array))
					logger('hiddenKeywords must be an Array or undefined but it is neither at index ' + index + ' where the name is ' + exampleInfo.name);
				else {
					const searchKeywords = new Set();
					if (exampleInfo.searchKeywords instanceof Array)
						SetUtils.addAll(searchKeywords, exampleInfo.searchKeywords);
					exampleInfo.hiddenKeywords.forEach(function(hiddenKeyword) {
						if (typeof hiddenKeyword !== 'string')
							logger(`Every element of hiddenKeywords must be a string but found ${hiddenKeyword} at example index ${index}, name = ${exampleInfo.name}`);
						if (searchKeywords.has(hiddenKeyword))
							logger(`Every element of hiddenKeywords must not be in searchKeywords but found ${hiddenKeyword} in both at example index ${index}, name = ${exampleInfo.name}`);
					});
				}
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
		{'mergeJavaScriptInstructions': true, 'forProduction': true, 'parsedOptimize': true,
		'translateToJavaScript': true}
	];
	fetchText(url).then(function(exampleContent) {
		let harmonizeChecked = false;
		const plogger = prefixWrapper(`URL: ${url}`, logger);
		validateExampleCodeBasic(exampleContent, plogger);
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
				validateVector2DDrawing(executer.turtle.drawing, plogger);
				const s = formatCode(exampleContent);
				if (typeof s !== 'string')
					plogger('Expected to get string from formatCode but got ' + s);
				else {
					compileCode(s, harmonizeChecked, exampleInfo, plogger);
					harmonizeChecked = true;
					// we don't want to check this repeatedly for no reason.
				}
				// help browser free memory.
				executer.turtle.drawing.disconnect();
				executer.disconnect(); 
			});
		}
	}).catch(function(e) {
		console.error(`url=${url}`,e);
		logger('Error while processing URL: ' + url + '.  The error information is: ' + e);
	});
}

async function testCompileAllExamples(logger) {
	const progressIndicator = new ProgressIndicator('testExampleScripts');
	logger.indicators.push(progressIndicator);
	for (let i = 0; i < examples.length; i++) {
		const exampleInfo = examples[i];
		const url = `logo-scripts/${exampleInfo.filename}?${Math.random(1)}`;
		testExample(exampleInfo, url, logger);
		await sleep(100);
		/*
		Sleeping can help prevent an error mentioned at: 
		https://stackoverflow.com/questions/24122506/neterr-insufficient-resources-error-when-adding-numerous-img-elements-to-dom
		I was getting net::ERR_INSUFFICIENT_RESOURCES thrown without the sleep.
		*/
		progressIndicator.setProgressRatio(i / examples.length);
		progressIndicator.setMessage(`${i} of ${examples.length}`);
	}
	progressIndicator.completed();
}

export function testExampleScripts(logger) {
	wrapAndCall([
		testJSONFormat,
		testCompileAllExamples
	], logger);
};