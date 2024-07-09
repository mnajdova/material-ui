import { namedTypes as types } from 'ast-types';
import { parse as parseDoctrine, Annotation } from 'doctrine';
import { utils as docgenUtils, NodePath, Documentation, builtinResolvers, Importer, Handler } from 'react-docgen';

const { getPropertyName, isReactForwardRefCall, printValue, resolveToValue } = docgenUtils;

// based on https://github.com/reactjs/react-docgen/blob/735f39ef784312f4c0e740d4bfb812f0a7acd3d5/src/handlers/defaultPropsHandler.js#L1-L112
// adjusted for material-ui getThemedProps
function getDefaultValue(propertyPath: NodePath) {
  console.log(propertyPath.get('value').isAssignmentPattern());
  if (!propertyPath.get('value').isAssignmentPattern()) {
    return null;
  }
  console.log("HERE");
  let path: NodePath = propertyPath.get('value', 'right');
  let node = path.node;

  let defaultValue: string | undefined;
  let resolvedPath = path;
  let valuePath = path;
  if (path.isBooleanLiteral()) {
    defaultValue = `${path.node.value}`;
  } else if (path.isNullLiteral()) {
    defaultValue = 'null';
  } else if (path.isLiteral()) {
    defaultValue = path.node.extra?.raw as string;
  } else {
    if (path.isAssignmentPattern()) {
      resolvedPath = resolveToValue(path.get('right'));
    } else {
      resolvedPath = resolveToValue(path);
    }
    if (resolvedPath.parentPath?.isImportDeclaration() && path.isIdentifier()) {
      defaultValue = path.node.name;
    } else {
      valuePath = resolvedPath;
      defaultValue = printValue(resolvedPath);
    }
  }
  if (typeof defaultValue !== 'undefined') {
    return {
      value: defaultValue,
      computed:
        valuePath.isCallExpression() ||
        valuePath.isMemberExpression() ||
        valuePath.isIdentifier(),
    };
  }

  return null;
}

function getJsdocDefaultValue(jsdoc: Annotation): { value: string } | undefined {
  const defaultTag = jsdoc.tags.find((tag) => tag.title === 'default');
  if (defaultTag === undefined) {
    return undefined;
  }
  return { value: defaultTag.description || '' };
}

function getDefaultValuesFromProps(
  properties: NodePath[],
  documentation: Documentation,
) {
  const { props: documentedProps } = documentation;
  const implementedProps: Record<string, NodePath> = {};
  properties
    .filter((propertyPath: NodePath) => types.Property.check(propertyPath.node), undefined)
    .forEach((propertyPath: NodePath) => {
      const propName = getPropertyName(propertyPath);
      if (propName) {
        implementedProps[propName] = propertyPath;
      }
    });

  // Sometimes we list props in .propTypes even though they're implemented by another component
  // These props are spread so they won't appear in the component implementation.
  Object.entries(documentedProps || []).forEach(([propName, propDescriptor]) => {
    if (propDescriptor.description === undefined) {
      // private props have no propsType validator and therefore
      // not description.
      // They are either not subject to eslint react/prop-types
      // or are and then we catch these issues during linting.
      return;
    }

    const jsdocDefaultValue = getJsdocDefaultValue(
      parseDoctrine(propDescriptor.description, {
        sloppy: true,
      }),
    );

    if (jsdocDefaultValue) {
      propDescriptor.jsdocDefaultValue = jsdocDefaultValue;
    }

    const propertyPath = implementedProps[propName];
    if (propertyPath !== undefined) {
      const defaultValue = getDefaultValue(propertyPath);
      if (defaultValue) {
        propDescriptor.defaultValue = defaultValue;
      }
    }
  });
}

function toNodePathArray(node: NodePath | NodePath[]): NodePath[] {
  return Array.isArray(node) ? node : [node];
}

function getRenderBody(componentDefinition: builtinResolvers.ComponentNodePath): NodePath[] {
  const value = resolveToValue(componentDefinition);
  if (isReactForwardRefCall(value)) {
    return toNodePathArray(value.get('arguments')[0].get('body.body'));
  }
  return toNodePathArray(value.get('body.body'));
}

/**
 * Handle the case where `props` is explicitly declared with/without `React.forwardRef(…)`:
 *
 * @example
 * const Component = React.forwardRef((props, ref) => {
 *   const { className, ...other } = props;
 * })
 */
function getExplicitPropsDeclaration(
  componentDefinition: builtinResolvers.ComponentNodePath,
): NodePath | undefined {
  const functionNode = getRenderBody(componentDefinition);

  let propsPath: NodePath | undefined;
  // visitVariableDeclarator, can't use visit body.node since it looses scope information
  functionNode
    .filter((path: NodePath) => {
      return types.VariableDeclaration.check(path.node);
    }, undefined)
    .forEach((path: NodePath) => {
      const declaratorPath = path.get('declarations')[0];
      // find `const {} = props`
      // but not `const ownerState = props`
      if (
        declaratorPath.get('init')?.node?.name === 'props' &&
        declaratorPath.get('id')?.node?.type === 'ObjectPattern'
      ) {
        propsPath = declaratorPath.get('id');
      }
    });

  if (!propsPath) {
    console.error(`${functionNode[0].parentPath?.get('id').node?.name}: could not find props declaration to generate jsdoc table. The component declaration should be in this format:

  function Component(props: ComponentProps) {
    const { ...spreadAsUsual } = props;
    ...
  }
    `);
  }

  return propsPath;
}

// TODO: Figure out why documentation is an empty object
const defaultPropsHandler: Handler = (documentation: Documentation, componentDefinition: builtinResolvers.ComponentNodePath) => {
  const props = getExplicitPropsDeclaration(componentDefinition);
  getDefaultValuesFromProps(props?.get('properties') ?? [], documentation);
};

export default defaultPropsHandler;
