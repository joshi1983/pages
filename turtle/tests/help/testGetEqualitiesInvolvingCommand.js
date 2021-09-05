import { LogoParser } from
'../../modules/parsing/LogoParser.js';
await LogoParser.asyncInit();

import { getEqualitiesInvolvingCommand } from
'../../modules/help/getEqualitiesInvolvingCommand.js';

export function testGetEqualitiesInvolvingCommand(logger) {
	const equalities = getEqualitiesInvolvingCommand('sin');
	if (!(equalities instanceof Array))
		logger(`Expected getEqualitiesInvolvingCommand('sin') to return an Array but found ${equalities}`);
	else {
		for (const equalityInfo of equalities) {
			if (!(equalityInfo instanceof Array)) {
				logger(`Every element should be an Array but found ${equalityInfo}`);
				break;
			}
			else if (equalityInfo.length < 2) {
				logger(`Every element should have length >= 2 but found element with length ${equalityInfo.length}`);
				break;				
			}
		}
	}
};