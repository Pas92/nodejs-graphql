import { GraphQLObjectType } from 'graphql';
import { CreatePostDTO, postInputType, postType } from './post.schema';
import {
  CreateProfileDTO,
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
          equals: (info.variableValues.profile as CreateProfileDTO).userId,
        }));

        if (!isUser) {
          throw new Error('User does not exist');
        }

        const isProfile = !!(await context.db.profiles.findOne({
          key: 'userId',
          equals: (info.variableValues.profile as CreateProfileDTO).userId,
        }));

        if (isProfile) {
          throw new Error('User is already has a profile');
        }

        return context.db.profiles.create(info.variableValues.profile);
      },
    },
    createPost: {
      type: postType,
      args: {
        post: {
          type: postInputType,
        },
      },
      variables: {
        post: {
          type: postInputType,
        },
      },
      resolve: async (_source, args, context, info) => {
        const isUser = !!(await context.db.users.findOne({
          key: 'id',
          equals: (info.variableValues.post as CreatePostDTO).userId,
        }));

        if (!isUser) {
          throw new Error('User does not exist');
        }

        return context.db.posts.create(info.variableValues.post);
      },
    },
  }),
});
