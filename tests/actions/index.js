import authFactory from './auth';
import postsFactory from './posts';

const actionsFactory = (request) => {
  return {
    auth: authFactory(request),
    posts: postsFactory(request),
  };
};

export default actionsFactory;
