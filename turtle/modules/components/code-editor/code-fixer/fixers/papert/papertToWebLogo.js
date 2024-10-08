import { BufferedParseLogger } from '../../../../../parsing/loggers/BufferedParseLogger.js';
import { compositeFixer } from './compositeFixer.js';
import { FixLogger } from '../../FixLogger.js';
import { formatCode } from '../../../format/formatCode.js';
import { getProceduresMap } from '../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from '../../../../../parsing/LogoParser.js';
import { wrappedFix } from '../../wrappedFix.js';
await LogoParser.asyncInit();

export function papertToWebLogo(code, parseLogger) {
	const tempParseLogger = new BufferedParseLogger();
	code = 'setLineCap "butt\n' + code;
	let tree = LogoParser.getParseTree(code, tempParseLogger);
	if (tree === undefined)
		return code; // the code is unfixable if it can't be parsed.
	const proceduresMap = getProceduresMap(tree);
	const fixLogger = new FixLogger(parseLogger);
	code = wrappedFix(code, compositeFixer, fixLogger, proceduresMap, tree);

	return formatCode(code, fixLogger);
};