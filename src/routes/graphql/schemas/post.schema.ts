import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';

export type CreatePostDTO = Omit<PostEntity, 'id'>;
export type ChangePostDTO = Partial<Omit<PostEntity, 'id' | 'userId'>>;

export const postType = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userId: {
      type: GraphQLID,
    },
  }),
});

export const postInputType = new GraphQLInputObjectType({
  name: 'postInput',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userId: {
      type: GraphQLID,
    },
  }),
});

export const postUpdateInputType = new GraphQLInputObjectType({
  name: 'postUpdateInput',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  }),
});
