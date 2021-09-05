import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { isLikelyPovRay } from '../../../modules/parsing/pov-ray/isLikelyPovRay.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from '../../helpers/parsing/webLogoExamplesContent.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, webLogoExamplesContent);

export function testIsLikelyPovRay(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'forward 10', 'out': false},
	{'in': 'repeat 3 []', 'out': false},
	{'in': '; hello', 'out': false},
	{'in': '; #declare x=4', 'out': false},
	{'in': 'to p\nend', 'out': false},
	{'in': 'finish{}', 'out': true},
	{'in': '#local D = 0.01;', 'out': true},
	{'in': `#declare Camera_0 = camera {ultra_wide_angle angle 75
                            location  <0.0 , 1.0, -12.0>
                            right x*image_width/image_height
                            look_at <0.0 , 5.0, 0.0>}`, 'out': true},
	{'in': 'camera{Camera_1}', 'out': true},
	{'in': 'light_source{<1500,2500,-2500> color White}', 'out': true},
	{'in': 'for ["x 4 3] []', 'out': false},
	{'in': 'for["x 4 3] []', 'out': false},
	{'in': 'for[x 4 3] []', 'out': false},
	{'in': 'for[x 4 3] [] finish{}', 'out': false},
	{'in': 'translate< 6, 0, 6>', 'out': true}
	];
	nonExamples.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, isLikelyPovRay, logger);
};