import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql';
import { memberType, memberTypeEnum } from './member-type.schema';
import { postType } from './post.schema';
import { profileType } from './profile.schema';
import {
  userType,
  userWithContentType,
  userWithSubscribedToUserPostsType,
  userWithUserSubscribedToProfilesType,
} from './user.schema';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Query',
  fields: () => ({
    user: {
      type: new GraphQLList(userType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      variables: {
        userID: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        if (info.variableValues.userID) {
          const user = await context.db.users.findOne({
            key: 'id',
            equals: args.id,
          });

          if (!user) {
            throw new Error(`User ${args.id} does not exist`);
          }

          return [user];
        }
        return context.db.users.findMany();
      },
    },
    userWithContent: {
      type: new GraphQLList(userWithContentType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      variables: {
        userID: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        if (info.variableValues.userID) {
          const user = await context.db.users.findOne({
            key: 'id',
            equals: args.id,
          });

          if (!user) {
            throw new Error(`User ${args.id} does not exist`);
          }

          return [user];
        }
        return context.db.users.findMany();
      },
    },
    userWithUserSubscribedToProfiles: {
      type: new GraphQLList(userWithUserSubscribedToProfilesType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      variables: {
        userID: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        if (info.variableValues.userID) {
          const user = await context.db.users.findOne({
            key: 'id',
            equals: args.id,
          });

          if (!user) {
            throw new Error(`User ${args.id} does not exist`);
          }

          return [user];
        }
        return context.db.users.findMany();
      },
    },
    userWithSubscribedToUserPosts: {
      type: new GraphQLList(userWithSubscribedToUserPostsType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      variables: {
        userID: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        if (info.variableValues.userID) {
          const user = await context.db.users.findOne({
            key: 'id',
            equals: args.id,
          });

          if (!user) {
            throw new Error(`User ${args.id} does not exist`);
          }

          return [user];
        }
        return context.db.users.findMany();
      },
    },
    profile: {
      type: new GraphQLList(profileType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      variables: {
        profileId: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        console.log(_source);
        if (info.variableValues.profileId) {
          const profile = await context.db.profiles.findOne({
            key: 'id',
            equals: args.id,
          });

          if (!profile) {
            throw new Error(`Profile ${args.id} does not exist`);
          }

          return Promise.resolve([profile]);
        }
        return context.db.profiles.findMany();
      },
    },
    post: {
      type: new GraphQLList(postType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      variables: {
        postId: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        if (info.variableValues.postId) {
          const post = await context.db.posts.findOne({
            key: 'id',
            equals: args.id,
          });

          if (!post) {
            throw new Error(`Post ${args.id} does not exist`);
          }

          return [post];
        }
        return context.db.posts.findMany();
      },
    },
    memberType: {
      type: new GraphQLList(memberType),
      args: {
        id: {
          type: memberTypeEnum,
        },
      },
      variables: {
        memberTypeId: {
          type: memberTypeEnum,
        },
      },
      resolve: async (_source, args, context, info) => {
        if (info.variableValues.memberTypeId) {
          const memberType = await context.db.memberTypes.findOne({
            key: 'id',
            equals: args.id,
          });

          if (!memberType) {
            throw new Error(`Member type ${args.id} does not exist`);
          }

          return Promise.resolve([memberType]);
        }
        return context.db.memberTypes.findMany();
      },
    },
  }),
});
