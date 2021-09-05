import { newTranslatePythonCodeToWebLogo } from
'../../../../modules/parsing/python-parsing/newTranslatePythonCodeToWebLogo.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { pythonExamplesMap } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';

export function testTranslateExamplesContains(logger) {
	const cases = [
		{"filename": "2kcreator-colourful-geometry.py",
		"checks": [
			"0.008",
			"1GU3XKP1pQY",
			"convertColorUsingMode",
			"penUp",
			"penDown"
		]}
	];
	cases.forEach(async function(caseInfo, index) {
		const code = pythonExamplesMap.get(caseInfo.filename);
		if (code === undefined)
			throw new Error(`Unable to get code for file ${caseInfo.filename}`);
		const result = newTranslatePythonCodeToWebLogo(code);
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		if (typeof result !== 'string')
			plogger(`Expected a string but found ${result}`);
		else {
			for (const substr of caseInfo.checks) {
				if (code.indexOf(substr) === -1) {
					plogger(`Expected to find ${substr} in translated result but did not.  result=${result}`);
					return;
				}
			}
		}
	});
};