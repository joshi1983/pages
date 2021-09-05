import { logoInterpreterExamples } from
'../../../../../helpers/parsing/logoInterpreterExamples.js';
import { logoInterpreterToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/logo-interpreter/logoInterpreterToWebLogo.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { webLogoExamplesContent } from
'../../../../../helpers/parsing/webLogoExamplesContent.js';

export function testLogoInterpreterToWebLogo(logger) {
	const examples = logoInterpreterExamples.concat(webLogoExamplesContent);
	examples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = logoInterpreterToWebLogo(content);
		if (typeof result !== 'string')
			plogger(`Expected a string but found ${result}`);
	});
};