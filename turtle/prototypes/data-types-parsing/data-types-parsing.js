import { initGenericParsing } from '../helpers/initGenericParsing.js';
import { parseDataTypeString } from
'../../modules/parsing/data-types/data-type-parsing/parseDataTypeString.js';
import { DataTypeTokenType } from
'../../modules/parsing/data-types/data-type-parsing/DataTypeTokenType.js';
import { validateDataTypeString } from
'../../modules/parsing/data-types/data-type-parsing/validateDataTypeString.js';

let code;
code = `list<num>`;
const validateTokensByType = undefined;
const translate = undefined;

initGenericParsing(DataTypeTokenType, parseDataTypeString, code, validateTokensByType,
	validateDataTypeString, translate);