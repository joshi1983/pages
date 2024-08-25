import { codeToTranslator } from '../../../../modules/components/code-editor/code-fixer/codeToTranslator.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from
'../../../helpers/parsing/webLogoExamplesContent.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

const webLogoExampleCases = webLogoExamplesContent.concat([
	`; Inspired by
; https://www.youtube.com/watch?v=hFj5-YwFCCY
to `,
`; https://www.youtube.com/watch?v=hFj5-YwFCCY
to`,
	'to',
	'to p',
	'to p\nend',
	`make "darkColor "#780
http://www.cropcircleconnector.com/Sorensen/2001/NineSpheresTK.jpg`
]);

const nonWebLogoTranslators = new Set([
]);
const cases = [];
function addCases(examples, translate, aesthetic) {
	if (!(examples instanceof Array))
		throw new Error(`Expected examples to be an Array but got ${examples}`);
	for (const example of examples) {
		cases.push({
			'in': example,
			'out': [translate, aesthetic],
			'equals': function(v1, v2) {
				if ((v1 instanceof Array) !== (v2 instanceof Array))
					return false;
				if (v1.length !== v2.length)
					return false;
				if (v1[0] !== v2[0])
					return false;
				if (v1[1] !== v2[1])
					return false;
				return true;
			}
		});
	}
}

function testWebLogoCases(logger) {
	webLogoExampleCases.forEach(function(content, index) {
		const [translator, adjustAesthetics] = codeToTranslator(content);
		if (typeof adjustAesthetics !== 'boolean')
			logger(`adjustAesthetics expected to be boolean but got ${adjustAesthetics}`);
		if (nonWebLogoTranslators.has(translator))
			logger(`WebLogo code should not get translated but codeToTranslator returned ${translator} for WebLogo example ${index} which has the code: ${content}`);
	});
};

function testNonWebLogoCases(logger) {
	testInOutPairs(cases, codeToTranslator, logger);
}

export function testCodeToTranslator(logger) {
	wrapAndCall([
		testNonWebLogoCases,
		testWebLogoCases
	], logger);
};