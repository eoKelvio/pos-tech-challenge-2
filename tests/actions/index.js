// const authModule = require('./auth');
// const authFactory =
//   authModule && authModule.default ? authModule.default : authModule;
// // const postFactory = require('./posts');

// function actionsFactory(request) {
//   return {
//     auth: authFactory(request),
//     // post: postFactory(request),
//   };
// }

// module.exports = actionsFactory;

import authFactory from './auth';

const actionsFactory = (request) => {
  return {
    auth: authFactory(request),
  };
};

export default actionsFactory;
