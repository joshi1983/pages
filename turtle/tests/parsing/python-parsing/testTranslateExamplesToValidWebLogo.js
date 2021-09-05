import { analyzeCodeQuality } from
'../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
//import { exceptionToString } from
//'../../../modules/exceptionToString.js';
import { getProceduresMap } from
'../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { pythonTurtleExampleFiles } from
'../../helpers/parsing/pythonTurtleExampleFiles.js';
import { pythonTurtleExampleFilesContent } from
'../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { TestParseLogger } from
'../../helpers/TestParseLogger.js';
import { translatePythonCodeToWebLogo } from
'../../../modules/parsing/python-parsing/translatePythonCodeToWebLogo.js';

const skippedNames = new Set([
	'circle-string-art.py',
	'colorful-example1.py',
	'user-input-pattern.py'
]);

export function testTranslateExamplesToValidWebLogo(logger) {
	pythonTurtleExampleFiles.forEach(function(filename, index) {
		if (skippedNames.has(filename))
			return;
		const plogger = prefixWrapper(`Case ${index}, filename=${filename}`, logger);
		try {
			const content = pythonTurtleExampleFilesContent[index];
			const webLogoCode = translatePythonCodeToWebLogo(content);
			if (typeof webLogoCode !== 'string')
				plogger(`Expected a string but found ${webLogoCode}`);
			else {
				const parseLogger = new TestParseLogger(plogger, webLogoCode, true);
				const tree = LogoParser.getParseTree(webLogoCode, parseLogger);
				if (tree !== undefined) {
					const proceduresMap = getProceduresMap(tree);
					const initialVariablesMap = new Map();
					analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
				}
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown. e=${exceptionToString(e)}`);
		}
	});
};