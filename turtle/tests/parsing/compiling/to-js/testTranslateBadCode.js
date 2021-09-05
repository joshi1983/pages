import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { Keyword } from
'../../../../modules/parsing/Keyword.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { translateWebLogoToJS } from
'../../../../modules/parsing/compiling/to-js/translateWebLogoToJS.js';

/*
If the translation fails, we still want some JavaScript code returned.
WebLogo's analyzeCodeQuality should find most problems with WebLogo code but 
some problems will unfortunately slip through.
To prevent the translator from ever throwing an error, we want all bad code to translate without throwing any errors.

*/
export function testTranslateBadCode(logger) {
	const badExamples = [
		'sin', 'sin "hi', 'sin true', 'transparent'
	];
	ArrayUtils.pushAll(badExamples, Array.from(Keyword.getAllKeywords()));
	badExamples.forEach(function(caseInfo, index) {
		const code = caseInfo;
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translateWebLogoToJS(code);			
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown while translating. e=${exceptionToString(e)}`);
		}
	});
};