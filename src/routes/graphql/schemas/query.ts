import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql';
import { memberType } from './member-type.schema';
import { postType } from './post.schema';
import { profileType } from './profile.schema';
import { userType } from './user.schema';

export const queryType = new GraphQLObjectType({
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
      resolve: async (_source, args, context) => {
        if (args.id) {
          const memberType = await context.db.memberTypes.findOne({
            key: 'id',
            equals: args.id,
          });

          if (!memberType) {
            throw new Error(`Member type ${args.id} does not exist`);
          }

          return [memberType];
        }
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
      resolve: async (_source, args, context) => {
        if (args.id) {
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
      resolve: async (_source, args, context) => {
        if (args.id) {
          const profile = await context.db.profiles.findOne({
            key: 'id',
            equals: args.id,
          });

          if (!profile) {
            throw new Error(`Profile ${args.id} does not exist`);
          }

          return [profile];
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
      resolve: async (_source, args, context) => {
        if (args.id) {
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
  }),
});
