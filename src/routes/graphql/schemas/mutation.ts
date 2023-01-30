import { GraphQLObjectType } from 'graphql';
import {
  ProfileInputType,
  profileInputType,
  profileType,
} from './profile.schema';
import { userInputType, userType } from './user.schema';

export const mutationType = new GraphQLObjectType({
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
    createProfile: {
      type: profileType,
      args: {
        profile: {
          type: profileInputType,
        },
      },
      variables: {
        profile: {
          type: profileInputType,
        },
      },
      resolve: async (_source, args, context, info) => {
        const isUser = !!(await context.db.users.findOne({
          key: 'id',
          equals: (info.variableValues.profile as ProfileInputType).userId,
        }));

        if (!isUser) {
          throw new Error('User is not exist');
        }

        const isProfile = !!(await context.db.profiles.findOne({
          key: 'userId',
          equals: (info.variableValues.profile as ProfileInputType).userId,
        }));

        if (isProfile) {
          throw new Error('User is already has a profile');
        }

        return context.db.profiles.create(info.variableValues.profile);
      },
    },
  }),
});
