import { IGraphqlApi, MappingTemplate } from 'aws-cdk-lib/aws-appsync';

import { CodeFirstSchema, Directive, GraphqlType, ObjectType, ResolvableField } from 'awscdk-appsync-utils';
import { capitalize } from '../../common/index.js';

const requestMappingTemplate = MappingTemplate.fromString(
  '{"version": "2018-05-29", "payload": $util.toJson($context.arguments)}',
);
const responseMappingTemplate = MappingTemplate.fromString('$util.toJson($context.result)');

export const addIamSubscriptionMutation = (
  api: IGraphqlApi,
  schema: CodeFirstSchema,
  fieldName: string,
  returnObjectType: ObjectType,
) =>
  schema.addMutation(
    fieldName,
    new ResolvableField({
      args: {
        action: GraphqlType.string({ isRequired: true }),
        entity: GraphqlType.string({ isRequired: true }),
        id: GraphqlType.id({ isRequired: true }),
        referenceId: GraphqlType.id(),
        userId: GraphqlType.id(),
      },
      dataSource: api.addNoneDataSource(`${capitalize(fieldName)}DataSource`),
      directives: [Directive.iam()],
      requestMappingTemplate,
      responseMappingTemplate,
      returnType: returnObjectType.attribute(),
    }),
  );
