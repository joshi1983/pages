import { processSpecialCommand } from '../../../../generic-parsing-utilities/processSpecialCommand.js';
import { renameWrap } from '../../../../generic-parsing-utilities/renameWrap.js';
import { sky_sphere } from './sky_sphere.js';
import { sphere } from './sphere.js';

const specials = [renameWrap('background', sky_sphere), sky_sphere, sphere];

const processSpecial = processSpecialCommand(specials);
export { processSpecial };