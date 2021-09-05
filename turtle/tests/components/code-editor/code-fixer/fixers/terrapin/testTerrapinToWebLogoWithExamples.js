import { terrapinToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/terrapin/terrapinToWebLogo.js';
import { terrapinExamples } from
'../../../../../helpers/parsing/terrapinExamples.js';

export function testTerrapinToWebLogoWithExamples(logger) {
	terrapinExamples.forEach(function(content, index) {
		const result = terrapinToWebLogo(content);
		if (typeof result !== 'string')
			logger(`Expected a string but found ${result}`);
	});
};