import { fetchJson } from '../../../../fetchJson.js';
import { fetchText } from '../../../../fetchText.js';
import { isApplicableTo, processFunctionCall } from
'./type-processors/processFunctionCall.js';
import { translateMicroABasicToQBasic } from
'./translateMicroABasicToQBasic.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

const prefix = './logo-scripts/basic/micro-a/';
const procs = await fetchJson(prefix + 'index.json');
const proceduresMap = new Map();
for (const proc of procs) {
	const url = prefix + proc;
	const index = proc.lastIndexOf('.');
	const procName = proc.substring(0, index);
	const code = await fetchText(url);
	proceduresMap.set(procName, code);
}

export function translateMicroABasicToWebLogo(code) {
	const qbasicCode = translateMicroABasicToQBasic(code);
	const options = {
		'shouldUseCustomProcessTokenForToken': isApplicableTo,
		'processToken': processFunctionCall,
		'extraBuiltInProceduresMap': proceduresMap
	};
	return translateQBASICToWebLogo(qbasicCode, options);
};