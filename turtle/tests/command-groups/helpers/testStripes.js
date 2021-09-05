import { createTestTurtle } from '../../helpers/createTestTurtle.js';
import { stripes } from '../../../modules/command-groups/helpers/stripes.js';
import { Transparent } from '../../../modules/Transparent.js';

export function testStripes(logger) {
	const cases = [
		{'inArgs': [2, 4, ["red"]]},
		{'inArgs': [4, 2, ["red"]]},
		{'inArgs': [2, 4, ["red", "black"]]},
		{'inArgs': [2, 4, ["red", Transparent]]},
		{'inArgs': [2, 4, ["#0123", Transparent]]},
		{'inArgs': [2, 4, ["#8123", Transparent]]},
		{'inArgs': [2, 4, ["red", "#8123"]]},
	];
	const turtle = createTestTurtle();
	cases.forEach(function(caseInfo, index) {
		stripes(turtle, ...caseInfo.inArgs);
	});
};