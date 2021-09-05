import { analyzeCodeQuality } from '../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { compile } from '../../modules/parsing/compile.js';
import { fetchJson } from '../../modules/fetchJson.js';
import { fetchText } from '../../modules/fetchText.js';
import { formatCode } from '../../modules/components/code-editor/format/formatCode.js';
import { getProceduresMap } from '../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { getTestExecuterForCode } from '../helpers/getTestExecuterForCode.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
const examples = await fetchJson('json/scriptExamples.json');

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
				if (index > 0 && exampleInfo.name.localeCompare(examples[index - 1].name) < 0)
					logger('Script example with name: ' + exampleInfo.name + ' is out of order with its previous example with name: ' + examples[index - 1].name);
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

function testCompileAllExamples(logger) {
	examples.forEach(function(exampleInfo) {
		const url = 'logo-scripts/' + exampleInfo.filename;
		fetchText(url).then(function(exampleContent) {

			function compileCode(code) {
				const parseLogger = new TestParseLogger(logger, code);
				const tree = LogoParser.getParseTree(code, parseLogger);
				if (parseLogger.hasLoggedErrors())
					logger('No parse errors expected but found some for script at url: ' + url);
				else {
					const proceduresMap = getProceduresMap(tree);
					const initialVariablesMap = new Map();
					analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
					if (parseLogger.hasLoggedErrors())
						logger('No analysis errors expected but some found at url: ' + url);
					else if (parseLogger.hasLoggedWarnings())
						logger('No analysis warnings expected but some found at url: ' + url);
					else {
						const program = compile(code, tree, parseLogger, new Map(), {'translateToJavaScript': false}, new Map());
						if (parseLogger.hasLoggedErrors())
							logger('No compile errors expected but some found at url: ' + url);
						else if (parseLogger.hasLoggedWarnings())
							logger('No analysis warnings expected but some found at url: ' + url);
						else if (program.instructions.length === 0 && program.procedures.size === 0)
							logger('No instructions and no procedures found in compiled code for example at url: ' + url);
					}
				}
				return parseLogger;
			}
			const parseLogger = compileCode(exampleContent);
			if (!parseLogger.hasLoggedErrorsOrWarnings()) {
				// see if any errors are thrown in the first 1000 instructions.
				const executer = getTestExecuterForCode(exampleContent, logger);
				executer.executeInstructionsSync(1000);
				const s = formatCode(exampleContent);
				if (typeof s !== 'string')
					logger('Expected to get string from formatCode but got ' + s);
				else {
					compileCode(s);
				}
			}
		}).catch(function(e) {
			console.error(e);
			logger('Error while processing URL: ' + url + '.  The error information is: ' + e);
		});
	});
}

export function testExampleScripts(logger) {
	testJSONFormat(prefixWrapper('testJSONFormat', logger));
	testCompileAllExamples(prefixWrapper('testCompileAllExamples', logger));
};