import { analyzeCodeQuality } from '../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { createTestTurtle } from '../helpers/createTestTurtle.js';
import { fetchJson } from '../../modules/fetchJson.js';
import { fetchText } from '../../modules/fetchText.js';
import { getProceduresMap } from '../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { LogoProgramExecuter } from '../../modules/parsing/execution/LogoProgramExecuter.js';
import { noop } from '../../modules/noop.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { primaryNameToFileName } from '../../modules/help/command-details/primaryNameToFileName.js';
import { testCodeToProgram } from '../helpers/testCodeToProgram.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
const commands = await fetchJson('json/commands.json');

function isCommandNameReferencedInHTML(commandInfo, html) {
	html = html.toLowerCase();
	const allNames = [commandInfo.primaryName, ...commandInfo.names];
	for (let i = 0; i < allNames.length; i++) {
		const name = allNames[i].toLowerCase();
		if (html.indexOf(name) !== -1)
			return true;
	}
	return false;
}

function isWarningsOfInterest(primaryName, warningLength) {
	if (primaryName === 'forever' && warningLength <= 1)
		return false;
	if (primaryName === 'finite?' && warningLength <= 2)
		return false;
	return true;
}

export function testCommandExamples(logger) {
	commands.forEach(function(commandInfo) {
		if (commandInfo.primaryName === 'forever' || commandInfo.primaryName === 'finite?')
			return;
		/* The forever example has an expected warning of an infinite loop.
		We won't test that to prevent showing an expected warning.
		*/
		const filename = `${primaryNameToFileName(commandInfo.primaryName)}.html`;
		const url = `content/help/commands/${filename}`;
		fetchText(url).then(function(html) {
			if (!isCommandNameReferencedInHTML(commandInfo, html))
				logger(`Every example is expected to mention the command but could not find the command mentioned in ${filename}`);
			const div = document.createElement('div');
			div.innerHTML = html;
			const codeElements = div.querySelectorAll('code');
			if (codeElements.length === 0)
				logger('Every command examples file should have at least 1 code element. No code element found in ' + url);
			else {
				codeElements.forEach(function(codeElement) {
					const s = codeElement.textContent;
					const sanitizeTip = 'Run "node sanitizeExamples.js" in content/help/commands directory to quickly fix problems like this.  ';
					if (s.trim() !== s)
						logger(sanitizeTip + 'Expected there to be no leading or trailing whitespaces but some found in ' + url);
					else if (codeElement.firstChild === null)
						logger(sanitizeTip + 'Every code element is expected to have content but none found in a code element within ' + url);
					else if (codeElement.firstChild.tagName === 'BR')
						logger(sanitizeTip + 'Example code elements should not start with br tag but one of the codes found in ' + url + ' does.');
					else if (codeElement.lastChild.tagName === 'BR')
						logger(sanitizeTip + 'Example code elements should not end with br tag but one of the codes found in ' + url + ' does.');
					const plogger = prefixWrapper('Code Example for command ' + commandInfo.primaryName, logger);
					const primaryName = commandInfo.primaryName;
					const parseLogger = new TestParseLogger(noop, s, primaryName !== 'finite?' && primaryName !== 'forever');
					const tree = LogoParser.getParseTree(s, parseLogger);
					if (parseLogger.hasLoggedErrorsOrWarnings())
						plogger('No errors or warnings expected while parsing but some found.  Errors are: ' 
							+ JSON.stringify(parseLogger.getErrors()) + ', warnings are: ' 
							+ JSON.stringify(parseLogger.getWarnings()));
					else {
						const proceduresMap = getProceduresMap(tree);
						analyzeCodeQuality(tree, parseLogger, proceduresMap, new Map(), {});
						if (parseLogger.hasLoggedErrors())
							plogger('No errors expected while analyzing code quality but some found.  Errors are: ' + JSON.stringify(parseLogger.getErrors()));
						else if (parseLogger.hasLoggedWarnings()) {
							const warnings = parseLogger.getWarnings();
							// We expect 1 warning for an infinite loop in the forever example.
							// Check if it is anything else.
							if (isWarningsOfInterest(commandInfo.primaryName, warnings.length))
								plogger('No warnings expected while analyzing code quality but some found. Warnings are: ' + JSON.stringify(warnings));

							const program = testCodeToProgram(s, plogger, {'translateToJavaScript': true});
							const turtle = createTestTurtle();
							const executer = new LogoProgramExecuter(turtle, program);
							executer.addEventListener('exception', function(e) {
								console.error(e);
								plogger(`Exception thrown while running example. e=${e}`);
							});
							executer.executeInstructionsSync(100);
						}
					}
				});
			}
		}).catch(function(e) {
			logger('Failed to get HTML for command ' + url + '. Error: ' + e);
		});
	});
};