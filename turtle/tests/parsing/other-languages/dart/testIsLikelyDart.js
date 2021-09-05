import { adaExamples } from
'../../../helpers/parsing/adaExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { bcplExamples } from
'../../../helpers/parsing/bcplExamples.js';
import { cssExamples } from
'../../../helpers/parsing/cssExamples.js';
import { dartExamples } from
'../../../helpers/parsing/dartExamples.js';
import { forthExamples } from
'../../../helpers/parsing/forthExamples.js';
import { haskellExamples } from
'../../../helpers/parsing/haskellExamples.js';
import { hpglExamples } from
'../../../helpers/parsing/hpglExamples.js';
import { isLikelyDart } from
'../../../../modules/parsing/other-languages/dart/isLikelyDart.js';
import { luaExamples } from
'../../../helpers/parsing/luaExamples.js';
import { povRayExamples } from
'../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(adaExamples,
bcplExamples, cssExamples,
forthExamples, haskellExamples, hpglExamples, luaExamples,
povRayExamples, processingExamples);

export function testIsLikelyDart(logger) {
	const cases = dartExamples.map(code => {
		return {
			'in': code,
			'out': true
		};
	});
	cases.push(
		{'in': `import 'package:greetings/hello.dart' deferred as hello;`, 'out': true},
		{'in': `import 'package:flutter/services.dart' show PlatformException;`, 'out': true},
		{'in': `import 'package:flutter/widgets.dart' hide Alignment;`, 'out': true},
		{'in': 'for (final object in flybyObjects) {}', 'out': true},
		{'in': `final name = 'Bob';`, 'out': true},
		{'in': `final String nickname = 'Bobby';`, 'out': true},
		{'in': 'b ??= value;', 'out': true},
		{'in': 'mixin Musical {}', 'out': true}
	);
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	
	testInOutPairs(cases, isLikelyDart, logger);
};