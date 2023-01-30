import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
} from 'graphql';

export const memberTypeEnum = new GraphQLEnumType({
  name: 'memberTypeEnum',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

export const memberType = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: {
      type: memberTypeEnum,
    },
    discount: {
      type: GraphQLInt,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  }),
});

export const memberInputUpdateType = new GraphQLInputObjectType({
  name: 'memberInputUpdateType',
  fields: () => ({
    discount: {
      type: GraphQLInt,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  }),
});
