import { GraphQLID, GraphQLObjectType } from 'graphql';
import {
  memberInputUpdateType,
  memberType,
  memberTypeEnum,
} from './member-type.schema';
import {
  CreatePostDTO,
  postInputType,
  postType,
  postUpdateInputType,
} from './post.schema';
import {
  CreateProfileDTO,
  profileInputType,
  profileType,
  profileUpdateInputType,
} from './profile.schema';
import { userInputType, userType, userUpdateInputType } from './user.schema';

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
    updateUser: {
      type: userType,
      args: {
        user: {
          type: userUpdateInputType,
        },
        id: {
          type: GraphQLID,
        },
      },
      variables: {
        user: {
          type: userUpdateInputType,
        },
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        const isUser = !!(await context.db.users.findOne({
          key: 'id',
          equals: args.id,
        }));

        if (!isUser) {
          throw new Error('User does not exist');
        }

        return context.db.users.change(args.id, info.variableValues.user);
      },
    },
    updateProfile: {
      type: profileType,
      args: {
        profile: {
          type: profileUpdateInputType,
        },
        id: {
          type: GraphQLID,
        },
      },
      variables: {
        profile: {
          type: profileUpdateInputType,
        },
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        const profile = await context.db.profiles.findOne({
          key: 'id',
          equals: args.id,
        });

        if (!profile) {
          throw new Error(`Profile with id ${args.id} does not exist`);
        }

        return context.db.profiles.change(args.id, info.variableValues.profile);
      },
    },
    updatePost: {
      type: postType,
      args: {
        post: {
          type: postUpdateInputType,
        },
        id: {
          type: GraphQLID,
        },
      },
      variables: {
        post: {
          type: postUpdateInputType,
        },
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        const post = await context.db.posts.findOne({
          key: 'id',
          equals: args.id,
        });

        if (!post) {
          throw new Error(`Post with id ${args.id} does not exist`);
        }

        return context.db.posts.change(args.id, info.variableValues.post);
      },
    },
    updateMemberType: {
      type: memberType,
      args: {
        memberTypeData: {
          type: memberInputUpdateType,
        },
        id: {
          type: memberTypeEnum,
        },
      },
      variables: {
        memberTypeData: {
          type: memberInputUpdateType,
        },
        id: {
          type: memberTypeEnum,
        },
      },
      resolve: async (_source, args, context, info) => {
        const memberTypeData = await context.db.memberTypes.findOne({
          key: 'id',
          equals: args.id,
        });

        if (!memberTypeData) {
          throw new Error(`Member type with id ${args.id} does not exist`);
        }

        return context.db.memberTypes.change(
          args.id,
          info.variableValues.memberTypeData
        );
      },
    },
    subscribeToUser: {
      type: userType,
      args: {
        currentUserId: {
          type: GraphQLID,
        },
        targetUserId: {
          type: GraphQLID,
        },
      },
      variables: {
        currentUserId: {
          type: GraphQLID,
        },
        targetUserId: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        if (args.targetUserId === args.currentUserId) {
          throw new Error('User can not subscribe himself');
        }

        const user = await context.db.users.findOne({
          key: 'id',
          equals: args.targetUserId,
        });

        if (!user) {
          throw new Error(`User with id ${args.targetUserId} does not exist`);
        }

        const user2 = await context.db.users.findOne({
          key: 'id',
          equals: args.currentUserId,
        });

        if (!user2) {
          throw new Error(`User with id ${args.currentUserId} does not exist`);
        }

        user.subscribedToUserIds.push(args.currentUserId);

        return context.db.users.change(args.targetUserId, user);
      },
    },

    unsubscribeFromUser: {
      type: userType,
      args: {
        currentUserId: {
          type: GraphQLID,
        },
        targetUserId: {
          type: GraphQLID,
        },
      },
      variables: {
        currentUserId: {
          type: GraphQLID,
        },
        targetUserId: {
          type: GraphQLID,
        },
      },
      resolve: async (_source, args, context, info) => {
        if (args.targetUserId === args.currentUserId) {
          throw new Error('User can not subscribe himself');
        }

        const currentUser = await context.db.users.findOne({
          key: 'id',
          equals: args.currentUserId,
        });

        const targetUser = await context.db.users.findOne({
          key: 'id',
          equals: args.targetUserId,
        });

        if (!currentUser) {
          throw new Error(`User with id ${args.currentUserId} does not exist`);
        }

        if (!targetUser) {
          throw new Error(`User with id ${args.targetUserId} does not exist`);
        }

        if (!targetUser.subscribedToUserIds.includes(args.currentUserId)) {
          throw new Error(
            `User with id ${args.targetUserId} does not follow to user with id ${args.currentUserId} exist`
          );
        }
        targetUser.subscribedToUserIds = currentUser.subscribedToUserIds.filter(
          (id: string) => id !== args.currentUserId
        );

        return context.db.users.change(args.targetUserId, currentUser);
      },
    },
  }),
});
