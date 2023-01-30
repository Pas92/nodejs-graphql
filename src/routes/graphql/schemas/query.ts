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
      type: new GraphQLList(profileType),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_source, _args, context) => {
        console.log('resolver profiles');
        console.log(_args);
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
      resolve: (_source, _args, context) => {
        console.log('resolver profiles');
        console.log(_args);
        return context.db.posts.findMany();
      },
    },
  }),
});
