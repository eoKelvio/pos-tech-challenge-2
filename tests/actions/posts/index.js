import postsActions from './posts';

const postsFactory = (request) => {
    return {
      posts: postsActions(request),
    };
  };
  
  export default postsFactory;
  