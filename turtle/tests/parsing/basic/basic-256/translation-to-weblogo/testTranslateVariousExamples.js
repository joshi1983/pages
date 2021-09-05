import { basic256Examples } from
'../../../../helpers/parsing/basic/basic256Examples.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { translateBasic256ToWebLogo } from
'../../../../../modules/parsing/basic/basic-256/translation-to-weblogo/translateBasic256ToWebLogo.js';

const examples = basic256Examples;

export function testTranslateVariousExamples(logger) {
	examples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translateBasic256ToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			logger(`An exception or error was thrown while translating case ${index}. e=${exceptionToString(e)}`);
		}
	});
};