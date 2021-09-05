import { fetchJson } from
'../../../fetchJson.js';
import { fetchText } from
'../../../fetchText.js';
import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from
'../../LogoParser.js';
import { ParseLogger } from
'../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { StringBuffer } from '../../../StringBuffer.js';

const prefix = 'logo-scripts/go-content/';
const procs = await fetchJson(prefix + 'index.json');
const procNameCodeMap = new Map();
for (const proc of procs) {
	const url = prefix + proc;
	const procName = proc.substring(0, proc.length - 4);
	procNameCodeMap.set(procName.toLowerCase(), await fetchText(url));
}

function isOfInterest(token) {
	return procNameCodeMap.has(token.val.toLowerCase());
}

export function getReferencedProcedures(code) {
	const result = new StringBuffer();
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree !== undefined) {
		const leafs = getDescendentsOfType(tree, ParseTreeTokenType.LEAF).filter(isOfInterest);
		const names = new Set(leafs.map(leaf => leaf.val.toLowerCase()));
		const namesArray = Array.from(names);
		namesArray.sort();
		for (const name of namesArray) {
			result.append(procNameCodeMap.get(name) + '\n\n');
		}
	}
	return result.toString();
};