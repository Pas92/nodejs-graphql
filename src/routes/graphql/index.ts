import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLObjectType } from 'graphql';
import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
} from 'graphql/type';
import { graphqlBodySchema } from './schema';

const memberType = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    discount: {
      type: GraphQLInt,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  }),
});

const userType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

const profileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    avatar: {
      type: GraphQLString,
    },
    sex: {
      type: GraphQLString,
    },
    birthday: {
      type: GraphQLString,
    },
    country: {
      type: GraphQLString,
    },
    street: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    memberTypeId: {
      type: GraphQLString,
    },
    userId: {
      type: GraphQLString,
    },
  }),
});

const userInputType = new GraphQLInputObjectType({
  name: 'userInput',
  fields: () => ({
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Query',
  fields: () => ({
    memberType: {
      type: new GraphQLList(memberType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_source, _args, context) => {
        console.log('resolver');
        console.log(_args);
        return context.db.memberTypes.findMany();
      },
    },
    user: {
      type: new GraphQLList(userType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_source, _args, context) => {
        console.log('resolver users');
        console.log(_args);
        return context.db.users.findMany();
      },
    },
    profile: {
      type: new GraphQLList(userType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_source, _args, context) => {
        console.log('resolver users');
        console.log(_args);
        return context.db.profiles.findMany();
      },
    },
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        user: {
          type: userInputType,
        },
      },
      variables: {
        user: {
          type: userInputType,
        },
      },
      resolve: (_source, args, context, info) => {
        return context.db.users.create(info.variableValues.user);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: queryType,
  types: [memberType, userType, profileType],
  mutation: mutationType,
});

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const response = await graphql({
        schema: schema,
        source: request.body.query!,
        contextValue: {
          db: fastify.db,
        },
        variableValues: request.body.variables,
      });
      console.log(request.body.variables);
      console.log(request.body.query);
      reply.send(response);
    }
  );
};

export default plugin;
