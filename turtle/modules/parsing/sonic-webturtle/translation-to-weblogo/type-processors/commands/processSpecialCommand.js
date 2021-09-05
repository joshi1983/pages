import { color } from './color.js';
import { pop } from './pop.js';
import { processSpecialCommand as genericProcessSpecialCommand } from
'../../../../generic-parsing-utilities/processSpecialCommand.js';
import { push } from './push.js';
import { thick } from './thick.js';
import { transparent } from './transparent.js';

const processSpecialCommand = genericProcessSpecialCommand([
color, pop, push, thick, transparent]);
export { processSpecialCommand };