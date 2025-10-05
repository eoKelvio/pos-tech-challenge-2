import authAction from './auth.js';

const authFactory = (request) => {
  return {
    auth: authAction(request),
  };
};

export default authFactory;
