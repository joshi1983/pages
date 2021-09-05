import { analyzeCodeQuality } from
'../../../../../modules/parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { getColorsCode } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/getColorsCode.js';
import { getProceduresMap } from
'../../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../../../modules/parsing/LogoParser.js';
import { parse } from
'../../../../../modules/parsing/basic/qbasic/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { qbasicExamples } from
'../../../../helpers/parsing/basic/qbasicExamples.js';
import { TestParseLogger } from
'../../../../helpers/TestParseLogger.js';

export function testGetColorsCode(logger) {
	qbasicExamples.forEach(function(code, index) {
		const parseResult = parse(code);
		const result = getColorsCode(parseResult.root);
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		if (typeof result !== 'string')
			plogger(`getColorsCode should always return a string but found ${result}`);
		else {
			const parseLogger = new TestParseLogger(plogger, result);
			const tree = LogoParser.getParseTree(result, parseLogger);
			if (tree === undefined)
				return;

			const proceduresMap = getProceduresMap(tree);
			const initialVariablesMap = new Map();
			analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
		}
	});
};