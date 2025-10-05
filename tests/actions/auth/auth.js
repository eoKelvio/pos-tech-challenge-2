const { lazylog } = require('../../shared/log');

class AuthActions {
  /**
   *
   * @param {import('playwright').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
  }

  async signup(data) {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    const response = await this.request.post('/auth/signup', {
      data: payload,
    });

    lazylog({ method: 'POST', payload, response: response });
    return response;
  }

  async signin(data) {
    const payload = {
      email: data.email,
      password: data.password,
    };

    const response = await this.request.post('/auth/signin', {
      data: payload,
    });

    lazylog({ method: 'POST', payload, response: response });
    return response;
  }

  async getMe(token) {
    const response = await this.request.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    lazylog({ method: 'GET', payload: { token }, response: response });
    return response;
  }
}

const authActionsFactory = (page) => new AuthActions(page);

export default authActionsFactory;
