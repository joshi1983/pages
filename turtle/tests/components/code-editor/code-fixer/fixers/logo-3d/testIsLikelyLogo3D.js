import { ArrayUtils } from '../../../../../../modules/ArrayUtils.js';
import { codeHeartTurtleScriptExamples } from
'../../../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { fetchJson } from '../../../../../../modules/fetchJson.js';
import { fetchText } from '../../../../../../modules/fetchText.js';
import { isLikelyLogo3D } from '../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/isLikelyLogo3D.js';
import { kturtleExampleFiles } from '../../../../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from '../../../../../helpers/parsing/logo3DExamples.js';
import { papertExamples } from '../../../../../helpers/parsing/papertExamples.js';
import { povRayExamples } from '../../../../../helpers/parsing/povRayExamples.js';
import { pythonTurtleExampleFilesContent } from '../../../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from './../../../../../helpers/parsing/webLogoExamplesContent.js';
import { ZippedExamples } from '../../../../../../modules/file/file-load-example/ZippedExamples.js';
const exampleScripts = await fetchJson('json/scriptExamples.json');
await ZippedExamples.asyncInit();
const extraNonLogo3DScripts = [
'drawDot3D.lgo',
'getPoint.lgo',
'nextLine3D.lgo',
'solarSystemSmall.lgo',
'solarSystem.lgo',
'sphere.lgo',
'xkcd.lgo',
'zzz.lgo',
'logo-scripts/msw-logo-examples/3DBITMAP.LGO',
'logo-scripts/msw-logo-examples/SOLAR.LGO',
'logo-scripts/msw-logo-examples/SPHERE.LGO'
];
const nonLogo3DScripts = [];
for (const filename of extraNonLogo3DScripts) {
	let url = filename;
	if (!filename.startsWith('logo-scripts'))
		url = `tests/data/logo-scripts/${filename}`;
	nonLogo3DScripts.push(await fetchText(url));
}
ArrayUtils.pushAll(nonLogo3DScripts, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonLogo3DScripts, codeHeartTurtleScriptExamples);
ArrayUtils.pushAll(nonLogo3DScripts, kturtleExampleFiles);
ArrayUtils.pushAll(nonLogo3DScripts, papertExamples);
ArrayUtils.pushAll(nonLogo3DScripts, povRayExamples);
ArrayUtils.pushAll(nonLogo3DScripts, webLogoExamplesContent);

export function testIsLikelyLogo3D(logger) {
	const cases = [
	{'in': `to aa :s
make d=-150

rpt 10
[

rpt 180 [ pu rt 90 fd d 
pd 
up 90 
rpt 180 [ fd 2 rt 2] dn 90
pu fd -d 
lt 90 fd 2 rt 2 sc rc
]
make d=d-:s
]
end`, 'out': true
	},
	{'in': '#timeout=4', 'out': true},
	{'in': '#timeout=1', 'out': true},
	{'in': '\nto 6 end', 'out': true},
	{'in': '\n#timeout=4', 'out': true},
	{'in': '\r#timeout=4', 'out': true},
	{'in': '\r\n#timeout=4', 'out': true},
	{'in': `#timeout=4
to p :forward
make x=:forward
fd x
end`, 'out': true},
// testing that the forward procedure parameter isn't incorrectly recognized 
// like a call to the forward command.
// The forward command is not supported by Logo 3D.  "fd" is used by Logo 3D instead of "forward".
	{'in': 'omark g', 'out': true},
	{'in': '\nomark g', 'out': true},
	{'in': ' omark x', 'out': true},
	{'in': '\romark g', 'out': true},
	{'in': '#timeout=4\nforward 100', 'out': false},
	// The timeout would be weird for a non-Logo 3D script but using 
	// forward is also very weird in a Logo 3D script.  "fd" is normal but "forward" would be weird.
	];
	logo3DExamples.forEach(function(code) {
		cases.push({'in': code, 'out': true});
	});
	nonLogo3DScripts.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, isLikelyLogo3D, logger);
};