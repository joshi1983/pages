import { FixLogger } from '../../../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { logo3DToWebLogo } from '../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/logo3DToWebLogo.js';
import { ParseLogger } from '../../../../../../modules/parsing/loggers/ParseLogger.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

function wrappedLogo3DToWebLogo(code) {
	const parseLogger = new ParseLogger();
	return logo3DToWebLogo(code, parseLogger);
}

export function testLogo3DToWebLogo(logger) {
	const cases = [
	{'in': '', 'out': `setScreenColor "black
setColors "white
`},
	{'in': 'dn 90 lt 90', 'out': `setScreenColor "black
setColors "white
pitchDown 90 lt 90`},
	{'in': 'arcup 10 100', 'out': `to arcUp :angle :radius
	rollRight 90
	arcLeft :angle :radius
	rollLeft 90
end

setScreenColor "black
setColors "white
arcUp 10 100`},
	{'in': 'arcup 10 100\narcup 15 250', 'out': `to arcUp :angle :radius
	rollRight 90
	arcLeft :angle :radius
	rollLeft 90
end

setScreenColor "black
setColors "white
arcUp 10 100
arcUp 15 250`},
	{'in': 'arcdown 10 100', 'out': `to arcDown :angle :radius
	rollRight 90
	arcLeft -:angle :radius
	rollLeft 90
end

setScreenColor "black
setColors "white
arcDown 10 100`},
	{'in': 'arcup 10 100\narcdown 20 300', 'out': `to arcUp :angle :radius
	rollRight 90
	arcLeft :angle :radius
	rollLeft 90
end

to arcDown :angle :radius
	rollRight 90
	arcLeft -:angle :radius
	rollLeft 90
end

setScreenColor "black
setColors "white
arcUp 10 100
arcDown 20 300`},
	{'in': `to cone
make a=175
make b=35
make c=0
rpt b
[ rpt 100
[fd 30 rt a make e=random 1000 make e=e+5000 fd e lt a fd e
up .1
rt 10
]
if c gt b/2 [make a=a+4]
else [make a=a-4]
make c=c+1 sc pick [red orange]
]
end

cone`, 'out': `setScreenColor "black
setColors "white
to cone
make "a
175 make "b
35 make "c
0 repeat 
:b[ repeat 100
[fd 30 rt  :a make "e random 1000 make "e :e+  5000 fd :e lt 
:a fd
:e pitchUp .1 rt 10
]
ifElse  :c >:b /2[ make "a
:a+4] [make "a :a-
4]make "c :c +1 setColors pick[ "red
"orange]]
end

cone`},
	{'in': '#timeout 120', 'out': `setScreenColor "black
setColors "white
 `}
	];
	testInOutPairs(cases, wrappedLogo3DToWebLogo, logger);
};