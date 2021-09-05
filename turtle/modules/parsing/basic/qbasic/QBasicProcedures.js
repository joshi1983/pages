import { fetchJson } from '../../../fetchJson.js';
import { toProcPath } from './QBasicInternalFunctions.js';

const QBasicProcedures = await fetchJson(toProcPath + '/index.json');

export { QBasicProcedures };