import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { insertBeginEndShape, pathFunctionNames, pathInteruptingNames, uninterestingNames } from
'../../../../../modules/parsing/kojo/translation-to-weblogo/simplifiers/insertBeginEndShape.js';
import { MigrationInfo } from
'../../../../../modules/parsing/kojo/MigrationInfo.js';
import { processSimplifierCases } from './processSimplifierCases.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

function testFunctionNamesInMigration(logger) {
	const names = [];
	ArrayUtils.pushAll(names, pathInteruptingNames);
	ArrayUtils.pushAll(names, pathFunctionNames);
	ArrayUtils.pushAll(names, uninterestingNames);
	names.forEach(function(name, index) {
		if (!MigrationInfo.hasInfoForFunctionName()) {
			logger(`Name ${index}, name=${name} not found in migration.json`);
		}
	});
}

function testGeneralCases(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'write(hello)', 'changed': false},
		{'code': 'forward(100)', 'changed': false},
		{'code': 'beginShape()', 'changed': false},
		{'code': 'forward(100)\nright(90)\nforward(100)', 'changed': false},
		{'code': 'forward(100)\nright(120)\nforward(100)\nright(120)\nforward(100)',
			'to': 'beginShape()\nforward(100)\nright(120)\nforward(100)\nright(120)\nforward(100)\nendShape()'
		},
	];
	processSimplifierCases(cases, insertBeginEndShape, logger);
}

export function testInsertBeginEndShape(logger) {
	wrapAndCall([
		testFunctionNamesInMigration,
		testGeneralCases
	], logger);
};