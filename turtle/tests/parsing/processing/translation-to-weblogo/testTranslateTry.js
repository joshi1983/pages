import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslateTry(logger) {
	const cases = [
		{'in': 'try {}', 'out': ''},
		{'in': 'try {println(x)}', 'out': 'print :x'},
		{'in': 'try {println(x)} catch(IOException e) {println("hello")}',
		'out': 'print :x'
		},
		{'in': 'try {} finally {}', 'out': ''},
		{'in': 'try {println("hi"); } finally {}',
		'out': 'print "hi'},
		{'in': 'try {println("hi")} finally {println("bye")}',
		'out': 'print "hi\nprint "bye'},
	];
	testInOutPairs(cases, translate, logger);
};