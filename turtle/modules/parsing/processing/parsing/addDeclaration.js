import { getDataTypeToken } from './getDataTypeToken.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldBeConvertedToDataType } from './shouldBeConvertedToDataType.js';

export function addDeclaration(previousToken) {
	const dataTypeToken = getDataTypeToken(previousToken);
	if (shouldBeConvertedToDataType(dataTypeToken))
		dataTypeToken.type = ParseTreeTokenType.DATA_TYPE;
	const varNameToken = previousToken;
	const declaration = new ParseTreeToken(null, dataTypeToken.lineIndex,
		dataTypeToken.colIndex, ParseTreeTokenType.DECLARATION);
	const parent = dataTypeToken.parentNode;
	dataTypeToken.remove();
	varNameToken.remove();
	declaration.appendChild(dataTypeToken);
	declaration.appendChild(varNameToken);
	parent.appendChild(declaration);
	return declaration;
};