import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { SmartRounder } from '../../../../../modules/drawing/vector/shapes/math/SmartRounder.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { Vector2D } from '../../../../../modules/drawing/vector/Vector2D.js';
import { Vector3D } from '../../../../../modules/drawing/vector/Vector3D.js';

function testEqualsCloseEnough(logger) {
	const cases = [
	{'inArgs': [0, 0], 'out': true},
	{'inArgs': [0, 1], 'out': false},
	{'inArgs': [new Vector2D(0, 0), new Vector2D(0, 0)], 'out': true},
	{'inArgs': [new Vector2D(0, 1), new Vector2D(0, 0)], 'out': false},
	{'inArgs': [new Vector2D(1, 0), new Vector2D(0, 0)], 'out': false},
	{'inArgs': [new Vector3D(0, 0, 0), new Vector3D(0, 0, 0)], 'out': true},
	{'inArgs': [new Vector3D(0, 0, 1), new Vector3D(0, 0, 0)], 'out': false},
	{'inArgs': [new Vector3D(0, 1, 0), new Vector3D(0, 0, 0)], 'out': false},
	{'inArgs': [new Vector3D(1, 0, 0), new Vector3D(0, 0, 0)], 'out': false},
	];
	const rounder = new SmartRounder(0.1);
	testInOutPairs(cases, function() {
		return rounder.equalsCloseEnough(...arguments);
	}, logger);
}

function testFormatNumber(logger) {
	const cases = [{
		'maxRoundingError': 0.01,
		'subcases': [
			{'in': 5.6000000000000005, 'out': '5.6'},
			{'in': 4.2862637970157365e-15, 'out': '0'},
			{'in': 140.89742261192856, 'out': '140.8974'},
			{'in': 0.38482906972160014, 'out': '0.3848'},
			{'in': 0.3800000, 'out': '0.38'},
			{'in': 210, 'out': '210'},
			{'in': 210.000000001, 'out': '210'},
		],
	}];
	cases.forEach(function(caseInfo, index) {
		const maxRoundingError = caseInfo.maxRoundingError;
		const rounder = new SmartRounder(maxRoundingError);
		const plogger = prefixWrapper(`Case ${index}. maxRoundingError=${maxRoundingError}`, logger);
		caseInfo.subcases.forEach(function(subcaseInfo) {
			const result = rounder.formatNumber(subcaseInfo.in);
			if (result !== subcaseInfo.out)
				plogger(`Expected ${subcaseInfo.out} but got ${result}`);
		});
	});
}

export function testSmartRounder(logger) {
	testEqualsCloseEnough(prefixWrapper('testEqualsCloseEnough', logger));
	testFormatNumber(prefixWrapper('testFormatNumber', logger));
};