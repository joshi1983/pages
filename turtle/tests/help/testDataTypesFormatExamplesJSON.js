import { Command } from '../../modules/parsing/Command.js';
import { DataTypes } from '../../modules/parsing/data-types/DataTypes.js';
import { fetchJson } from '../../modules/fetchJson.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';
await Command.asyncInit();
await DataTypes.asyncInit();
const data = await fetchJson('json/dataTypesFormatExamples.json');

function everyDataTypeNameShouldHaveCorrespondingExample(logger) {
	DataTypes.typesArray.forEach(function(dataType) {
		if (!data.some(exampleInfo => exampleInfo.name === dataType.name)) {
			logger(`Every DataType name should have corresponding example but no example found for name ${dataType.name}`);
		}
	});
}

function parseAllNamesAndCheckContainsAllExamples(logger) {
	data.forEach(function(example, index) {
		const plogger = prefixWrapper(`Example ${index}, name=${example.name}`, logger);
		if (typeof example.name !== 'string')
			plogger(`Expected every example to have a string name but instead got ${example.name}`);
		const dataTypes = new DataTypes(example.name);
		example.examples.forEach(function(exampleValue) {
			if (!dataTypes.mayBeCompatibleWithValue(exampleValue))
				plogger(`Expected ${example.name} to contain value ${exampleValue} but got false.`);
		});
	});
}

function validateDescription(logger) {
	data.forEach(function(example, index) {
		if (typeof example.description !== 'string')
			logger(`Every example expected to have a string description but found ${example.description} in example ${index}`);
	});
}

function validateNotExamples(logger) {
	data.forEach(function(example, index) {
		const plogger = prefixWrapper(`Example ${index}, name=${example.name}`, logger);
		if (!(example.notExamples instanceof Array))
			plogger(`Expected notExamples to be an Array but got ${example.notExamples}`);
		else {
			const dataTypes = new DataTypes(example.name);
			example.notExamples.forEach(function(val) {
				if (dataTypes.mayBeCompatibleWithValue(val))
					plogger(`Expected ${example.name} to not contain value ${val} but got true.`);
			});
		}
	});
}

function validateSeeAlso(logger) {
	data.forEach(function(example, index) {
		if (example.seeAlso !== undefined) {
			const plogger = prefixWrapper(`Example ${index}, name=${example.name}`, logger);
			if (!(example.seeAlso instanceof Array))
				plogger(`Expected an Array but got ${example.seeAlso}`);
			else {
				example.seeAlso.forEach(function(commandName) {
					const info = Command.getCommandInfo(commandName);
					if (info === undefined)
						plogger(`Expected to find a command named ${commandName} but unable to find it`);
				});
			}
		}
	});
}

function validateSubsetTypes(logger) {
	data.forEach(function(example, index) {
		if (example.subsetTypes !== undefined) {
			const plogger = prefixWrapper(`Example ${index}, name=${example.name}`, logger);
			if (!(example.subsetTypes instanceof Array))
				plogger(`Expected an Array but got ${example.subsetTypes}`);
			else {
				const dataTypes = new DataTypes(example.name);
				example.subsetTypes.forEach(function(subsetTypesString) {
					const otherDataTypes = new DataTypes(subsetTypesString);
					if (!DataTypes.contains(dataTypes.types, otherDataTypes.types))
						plogger(`Expected ${example.name} to contain ${subsetTypesString} but got false`);
					if (DataTypes.contains(otherDataTypes.types, dataTypes.types))
						plogger(`Expected ${subsetTypesString} to not contain ${example.name}`);
				});
			}
		}
	});
}

export function testDataTypesFormatExamplesJSON(logger) {
	wrapAndCall([
		everyDataTypeNameShouldHaveCorrespondingExample,
		parseAllNamesAndCheckContainsAllExamples,
		validateDescription,
		validateNotExamples,
		validateSeeAlso,
		validateSubsetTypes,
	], logger);
};