import { GraphqlType, ObjectType } from 'awscdk-appsync-utils';

export const user = new ObjectType('User', {
  definition: {
    created: GraphqlType.awsDateTime({ isRequired: true }),
    email: GraphqlType.awsEmail({ isRequired: true }),
    firstName: GraphqlType.string(),
    id: GraphqlType.id({ isRequired: true }),
    lastName: GraphqlType.string(),
    disabled: GraphqlType.boolean(),
    sub: GraphqlType.string({ isRequired: true }),
    updated: GraphqlType.awsDateTime({ isRequired: false }),
  },
});
