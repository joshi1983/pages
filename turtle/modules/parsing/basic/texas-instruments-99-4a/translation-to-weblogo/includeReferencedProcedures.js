import { fetchJson } from
'../../../../fetchJson.js';
import { fetchText } from
'../../../../fetchText.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from
'../../../LogoParser.js';
import { ParseLogger } from
'../../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { StringBuffer } from
'../../../../StringBuffer.js';

const prefix = 'logo-scripts/texas-instruments-99-a4/';
const index = await fetchJson(prefix + 'index.json');
const procsMap = new Map();
for (const name of index) {
	const url = prefix + name;
	const content = await fetchText(url);
	const procName = name.substring(0, name.lastIndexOf('.'));
	procsMap.set(procName.toLowerCase(), content);
}

export function includeReferencedProcedures(webLogoCode) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(webLogoCode, parseLogger);
	if (tree === undefined)
		return webLogoCode;

	const procRefTokens = getDescendentsOfType(tree, ParseTreeTokenType.LEAF).filter(t => procsMap.has(t.val.toLowerCase()));
	if (procRefTokens.length === 0)
		return webLogoCode;
	
	let prefix = new StringBuffer();
	const procNameSet = new Set(procRefTokens.map(p => p.val.toLowerCase()));
	const sortedProcNames = Array.from(procNameSet);
	sortedProcNames.sort();
	for (const procName of sortedProcNames) {
		prefix.append(procsMap.get(procName) + '\n\n');
	}

	return prefix + webLogoCode;
};