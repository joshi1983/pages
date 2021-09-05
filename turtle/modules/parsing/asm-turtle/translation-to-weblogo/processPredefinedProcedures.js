import { fetchText } from '../../../fetchText.js';
import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from '../../LogoParser.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const asmTurtleColorProcedureContent = await fetchText('logo-scripts/asm-turtle-content/asmTurtleColor.lgo');
const procName = 'asmturtlecolor';

function isAsmTurtleColorNeeded(webLogoCode) {
	webLogoCode = webLogoCode.toLowerCase();
	if (webLogoCode.indexOf(procName) === -1)
		return false;
	else {
		const logger = new ParseLogger();
		const parseTree = LogoParser.getParseTree(webLogoCode, logger);
		if (parseTree === undefined)
			return true; // be on the safe side.  Include the procedure when we're not sure.
		return getDescendentsOfType(parseTree, ParseTreeTokenType.LEAF).
			some(tok => tok.val.toLowerCase() === procName);
	}
}

export function processPredefinedProcedures(translatedCode) {
	if (isAsmTurtleColorNeeded(translatedCode)) {
		return asmTurtleColorProcedureContent + "\n\n" + translatedCode;
	}
	return translatedCode;
};