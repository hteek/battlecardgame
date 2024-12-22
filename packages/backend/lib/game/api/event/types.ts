import { GraphqlType, InputType, ObjectType } from 'awscdk-appsync-utils';

export const eventData = new ObjectType('EventData', {
  definition: {
    card: GraphqlType.string(),
    from: GraphqlType.string({ isRequired: true }),
    fromPosition: GraphqlType.int(),
    to: GraphqlType.string({ isRequired: true }),
    toPosition: GraphqlType.int(),
  },
});

export const event = new ObjectType('Event', {
  definition: {
    created: GraphqlType.awsDateTime({ isRequired: true }),
    data: GraphqlType.intermediate({ intermediateType: eventData }),
    gameId: GraphqlType.id({ isRequired: true }),
    id: GraphqlType.id({ isRequired: true }),
    name: GraphqlType.id({ isRequired: true }),
    opponentId: GraphqlType.id({ isRequired: true }),
    updated: GraphqlType.awsDateTime({ isRequired: false }),
    userId: GraphqlType.id({ isRequired: true }),
  },
});

export const eventDataInput = new InputType('EventDataInput', {
  definition: {
    card: GraphqlType.string(),
    from: GraphqlType.string({ isRequired: true }),
    fromPosition: GraphqlType.int(),
    to: GraphqlType.string({ isRequired: true }),
    toPosition: GraphqlType.int(),
  },
});
