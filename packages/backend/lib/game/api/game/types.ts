import { GraphqlType, ObjectType } from 'awscdk-appsync-utils';

export const game = new ObjectType('Game', {
  definition: {
    created: GraphqlType.awsDateTime({ isRequired: true }),
    id: GraphqlType.id({ isRequired: true }),
    userEmail: GraphqlType.id({ isRequired: true }),
    userId: GraphqlType.id({ isRequired: true }),
    opponentEmail: GraphqlType.id({ isRequired: true }),
    opponentId: GraphqlType.id({ isRequired: true }),
    updated: GraphqlType.awsDateTime({ isRequired: false }),
  },
});
