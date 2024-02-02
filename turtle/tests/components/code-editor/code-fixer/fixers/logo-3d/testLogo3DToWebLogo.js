import { FixLogger } from '../../../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { logo3DToWebLogo } from '../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/logo3DToWebLogo.js';
import { ParseLogger } from '../../../../../../modules/parsing/loggers/ParseLogger.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

function wrappedLogo3DToWebLogo(code) {
	const parseLogger = new ParseLogger();
	const fixLogger = new FixLogger(parseLogger);
	return logo3DToWebLogo(code, fixLogger);
}

export function testLogo3DToWebLogo(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'arcup 10 100', 'out': `to arcUp :angle :radius
	rollRight 90
	arcLeft :angle :radius
	rollLeft 90
end

arcUp 10 100`},
	{'in': 'arcup 10 100\narcup 15 250', 'out': `to arcUp :angle :radius
	rollRight 90
	arcLeft :angle :radius
	rollLeft 90
end

arcUp 10 100
arcUp 15 250`},
	{'in': 'arcdown 10 100', 'out': `to arcDown :angle :radius
	rollRight 90
	arcLeft -:angle :radius
	rollLeft 90
end

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

arcUp 10 100
arcDown 20 300`},
	];
	testInOutPairs(cases, wrappedLogo3DToWebLogo, logger);
};