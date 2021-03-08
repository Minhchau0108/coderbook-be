import * as types from "../constants/post.constants";

const initialState = {
  posts: [],
  totalPageNum: 1,
  selectedPost: null,
  loading: false,
  currentPage: 1,
};

const postReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.POST_REQUEST:
    case types.CREATE_POST_REQUEST:
    case types.UPDATE_POST_REQUEST:
    case types.DELETE_POST_REQUEST:
    case types.GET_SINGLE_POST_REQUEST:
      return { ...state, loading: true };

    case types.POST_REQUEST_SUCCESS:
      let updatedPosts;
      if (payload.currentPage === 1) {
        updatedPosts = [...payload.posts.posts];
      }
      if (payload.currentPage !== 1) {
        updatedPosts = [...state.posts, ...payload.posts.posts];
      }
      return {
        ...state,
        loading: false,
        posts: updatedPosts,
        currentPage: payload.currentPage,
        totalPageNum: payload.posts.totalPages,
      };

    case types.GET_SINGLE_POST_REQUEST_SUCCESS:
      return { ...state, selectedPost: payload, loading: false };

    case types.UPDATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedPost: payload,
      };

    case types.CREATE_POST_FAILURE:
    case types.UPDATE_POST_FAILURE:
    case types.DELETE_POST_FAILURE:
    case types.POST_REQUEST_FAILURE:
    case types.GET_SINGLE_POST_REQUEST_FAILURE:
      return { ...state, loading: false };

    case types.CREATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case types.DELETE_POST_SUCCESS:
      console.log("payload delte here", payload._id);
      console.log(
        "retunr",
        state.posts.filter((p) => p._id !== payload._id)
      );
      return {
        ...state,
        loading: false,
        posts: state.posts.filter((p) => p._id !== payload._id),
      };

    case types.SEND_REACTION_REQUEST:
    case types.CREATE_REVIEW_REQUEST:
      return { ...state, submitLoading: true };

    case types.CREATE_COMMENT_SUCCESS:
      console.log("create comment here");
      console.log("payload", payload);
      return {
        ...state,
        loading: false,
        posts: [
          ...state.posts.map((p) => {
            if (p._id !== payload._id) return p;
            return { ...p, comments: payload.comments };
          }),
        ],
      };
    case types.CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        submitLoading: false,
        selectedPost: {
          ...state.selectedPost,
          comments: [...state.selectedPost.comments, payload],
        },
      };

    case types.POST_REACTION_SUCCESS:
      console.log("payload", payload);
      return {
        ...state,
        loading: false,
        posts: [
          ...state.posts.map((p) => {
            if (p._id !== payload._id) return p;
            return { ...p, reactions: payload.reactions };
          }),
        ],
      };

    case types.COMMENT_REACTION_SUCCESS:
      console.log("payload", payload);
      return {
        ...state,
        loading: false,
        posts: [
          ...state.posts.map((p) => {
            if (p._id !== payload._id) return p;
            return { ...p, comments: payload.comments };
          }),
        ],
      };

    case types.SEND_REACTION_FAILURE:
    case types.CREATE_REVIEW_FAILURE:
      return { ...state, submitLoading: false };
    default:
      return state;
  }
};

export default postReducer;
