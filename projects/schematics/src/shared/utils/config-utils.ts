import { findNode, findNodes } from '@angular/cdk/schematics';
import {
  getDecoratorMetadata,
  getMetadataField,
} from '@schematics/angular/utility/ast-utils';
import {
  Change,
  InsertChange,
  ReplaceChange,
} from '@schematics/angular/utility/change';
import * as ts from 'typescript';
import { ANGULAR_CORE, B2C_STOREFRONT_MODULE } from '../constants';

/**
 * Finds the Storefront config in the given app.module.ts
 * @param appModuleSourceFile
 */
export function getExistingStorefrontConfigNode(
  appModuleSourceFile: ts.SourceFile
): ts.CallExpression | undefined {
  const metadata = getDecoratorMetadata(
    appModuleSourceFile,
    'NgModule',
    ANGULAR_CORE
  )[0] as ts.ObjectLiteralExpression;

  if (!metadata) {
    return undefined;
  }

  const matchingProperties = getMetadataField(metadata, 'imports');
  if (!matchingProperties) {
    return undefined;
  }

  const assignment = matchingProperties[0] as ts.PropertyAssignment;
  const arrayLiteral = assignment.initializer;
  if (!ts.isArrayLiteralExpression(arrayLiteral)) {
    return undefined;
  }

  // find the B2cStorefrontModule.withConfig call expression node
  return arrayLiteral.elements.filter(
    (node) =>
      ts.isCallExpression(node) &&
      node.getFullText().indexOf(`${B2C_STOREFRONT_MODULE}.withConfig`) !== -1
  )[0] as ts.CallExpression;
}

/**
 * Find the `configName` in the given `callExpressionNode`.
 *
 * @param callExpressionNode
 * @param configName
 */
export function getConfig(
  callExpressionNode: ts.CallExpression,
  configName: string
): ts.SyntaxList | undefined {
  const propertyAssignments = findNodes(
    callExpressionNode,
    ts.SyntaxKind.PropertyAssignment
  );
  for (const propertyAssignment of propertyAssignments) {
    const config = findNode(
      propertyAssignment,
      ts.SyntaxKind.Identifier,
      configName
    );
    if (config) {
      const syntaxListNodes = findNodes(
        config.parent,
        ts.SyntaxKind.SyntaxList,
        1,
        true
      );
      return syntaxListNodes.length
        ? (syntaxListNodes[0] as ts.SyntaxList)
        : undefined;
    }
  }

  return undefined;
}

/**
 * The method checks if the config with the given `configName` exists.
 * If it does exist, the `newValues` are merged to it.
 * If it doesn't exist, the new config is created instead.
 *
 * @param path the file path
 * @param configObject the config object in which to look into
 * @param configName the new or existing config's name
 * @param newValues new values to insert
 */
export function mergeConfig(
  path: string,
  configObject: ts.SyntaxList,
  configName: string,
  newValues: string | string[]
): Change {
  const configIdentifier = findNodes(
    configObject,
    ts.SyntaxKind.Identifier
  ).filter((node) => node.getText() === configName)[0];

  if (!configIdentifier) {
    return createNewConfig(path, configObject, configName, newValues);
  }

  const configPropertyAssignment = configIdentifier.parent as ts.PropertyAssignment;
  const currentArrayConfigNode = findNodes(
    configPropertyAssignment,
    ts.SyntaxKind.ArrayLiteralExpression,
    1,
    false
  )[0];
  if (currentArrayConfigNode) {
    return handleArrayConfigMerge(path, currentArrayConfigNode, newValues);
  }

  return handleRegularConfigMerge(path, configPropertyAssignment, newValues);
}

/**
 * Handles the merging of a regular (non-array) config
 * @param path to a file
 * @param configPropertyAssignment the config node
 * @param newValues the new values to set to the given config node
 */
function handleRegularConfigMerge(
  path: string,
  configPropertyAssignment: ts.PropertyAssignment,
  newValues: string | string[]
): Change {
  const stringConfigNode = findNodes(
    configPropertyAssignment,
    ts.SyntaxKind.StringLiteral,
    1,
    false
  )[0];

  const configValue = convert(newValues);
  const change = new ReplaceChange(
    path,
    stringConfigNode.getStart(),
    stringConfigNode.getText(),
    configValue
  );
  return change;
}

/**
 * Method creates the new configuration key inside of the give `configObject`.
 *
 * @param path the file path
 * @param configObject the config object in which to create the new config property
 * @param propertyName the name of the new config key
 * @param newValues the value
 */
function createNewConfig(
  path: string,
  configObject: ts.SyntaxList,
  propertyName: string,
  newValues: string | string[]
): Change {
  const configValue = convert(newValues);
  const indentation = ' '.repeat(configObject.getLeadingTriviaWidth() - 1);
  const insertChange = new InsertChange(
    path,
    configObject.getStart(),
    `${propertyName}: ${configValue},\n${indentation}`
  );
  return insertChange;
}

/**
 * The method parses the given `arrayConfigNode` and merges the
 * given `newValues` into it.
 *
 * @param path the file path
 * @param arrayConfigNode the config object in which to look into
 * @param newValues new values to insert
 */
function handleArrayConfigMerge(
  path: string,
  arrayConfigNode: ts.Node,
  newValues: string | string[]
): Change {
  const currentConfigValues = parseArrayConfig(arrayConfigNode);
  const mergedConfigs = mergeConfigs(currentConfigValues, newValues);

  const change = new ReplaceChange(
    path,
    arrayConfigNode.getStart(),
    arrayConfigNode.getText(),
    mergedConfigs
  );
  return change;
}

/**
 * The method parses the given array string by removing all the whitespace characters, etc.
 * @param node config node
 */
function parseArrayConfig(node: ts.Node): string[] {
  let config = node.getText().replace(/\s/gm, '').replace(/\'/gm, '');
  // remove the opening `[` and the closing `]` characters
  config = config.substring(1, config.length - 1);
  return config.split(',');
}

/**
 * Merges the given the given `newRawValues` into the `currentConfigValues`
 * @param currentConfigValues the current values
 * @param newRawValues the new values to merge in
 */
function mergeConfigs(
  currentConfigValues: string[],
  newRawValues: string | string[]
): string {
  const newValues: string[] = [].concat(newRawValues as any);
  const newConfigValues = [...currentConfigValues];
  for (const newValue of newValues) {
    if (!currentConfigValues.includes(newValue)) {
      newConfigValues.push(newValue);
    }
  }

  return transformArray(newConfigValues);
}

/**
 * Transforms the given array into a string
 * @param values array values
 */
function transformArray(values: string[]): string {
  const csv = values.map((value) => `'${value}'`).join(', ');
  return `[${csv}]`;
}

/**
 * Returns a single string from the give new values(s)
 * @param newValues a single string, or an array of strings
 */
function convert(newValues: string | string[]): string {
  let configValue: string;
  if (Array.isArray(newValues)) {
    configValue = transformArray(newValues);
  } else {
    configValue = newValues;
  }
  return configValue;
}
