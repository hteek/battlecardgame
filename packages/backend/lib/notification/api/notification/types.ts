import { Directive, GraphqlType, ObjectType } from 'awscdk-appsync-utils';

export const notification = new ObjectType('Notification', {
  definition: {
    action: GraphqlType.string({ isRequired: true }),
    entity: GraphqlType.string({ isRequired: true }),
    id: GraphqlType.id({ isRequired: true }),
    referenceId: GraphqlType.id(),
    userId: GraphqlType.id(),
  },
  directives: [Directive.iam()],
});
