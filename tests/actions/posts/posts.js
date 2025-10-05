const { lazylog } = require('../../shared/log');

class PostsActions {
  /**
   *
   * @param {import('playwright').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
  }

  async createPost({ data, token }) {
    const payload = {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      type: data.type,
      status: data.status,
    };

    const response = await this.request.post('/posts', {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    lazylog({
      method: 'POST',
      payload: { payload, token },
      response: response,
    });
    return response;
  }

  async getPublicPosts() {
    const response = await this.request.get('/posts', {});

    lazylog({ method: 'GET', response: response });
    return response;
  }

  async getAllPosts(token) {
    const response = await this.request.get('/posts/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    lazylog({ method: 'GET', payload: { token }, response: response });
    return response;
  }

  async getPostById({ id, token }) {
    const response = await this.request.get(`/posts/${id}`, {
      ...(token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {}),
    });

    lazylog({ method: 'GET', payload: { id, token }, response: response });
    return response;
  }

  async searchPosts({ title, token }) {
    const params = {
      title,
    };

    const response = await this.request.get('/posts/search', {
      params,
      ...(token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {}),
    });

    lazylog({ method: 'GET', payload: { params, token }, response: response });
    return response;
  }

  async updatePost({ id, data, token }) {
    const payload = {
      title: data.title,
      content: data.content,
      type: data.type,
      status: data.status,
    };

    const response = await this.request.put(`/posts/${id}`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    lazylog({
      method: 'PUT',
      payload: { id, payload, token },
      response: response,
    });
    return response;
  }

  async deletePost({ id, token }) {
    const response = await this.request.delete(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    lazylog({ method: 'DELETE', payload: { id, token }, response: response });
    return response;
  }
}

const postsActions = (page) => new PostsActions(page);

export default postsActions;
