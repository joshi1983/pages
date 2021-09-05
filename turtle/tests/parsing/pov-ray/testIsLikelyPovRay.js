import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { asmTurtleExamples } from '../../helpers/parsing/asmTurtleExamples.js';
import { kturtleExampleFiles } from '../../helpers/parsing/kturtleExampleFiles.js';
import { isLikelyPovRay } from '../../../modules/parsing/pov-ray/isLikelyPovRay.js';
import { logo3DExamples } from '../../helpers/parsing/logo3DExamples.js';
import { papertExamples } from '../../helpers/parsing/papertExamples.js';
import { povRayExamples } from '../../helpers/parsing/povRayExamples.js';
import { pythonTurtleExampleFilesContent } from '../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from '../../helpers/parsing/webLogoExamplesContent.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, asmTurtleExamples);
ArrayUtils.pushAll(nonExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonExamples, logo3DExamples);
ArrayUtils.pushAll(nonExamples, papertExamples);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonExamples, webLogoExamplesContent);

export function testIsLikelyPovRay(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'forward 10', 'out': false},
	{'in': 'repeat 3 []', 'out': false},
	{'in': '; hello', 'out': false},
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
	povRayExamples.forEach(function(content) {
		cases.push({'in': content, 'out': true});
	});
	nonExamples.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, isLikelyPovRay, logger);
};