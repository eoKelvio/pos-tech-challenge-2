import { expect, test } from '@playwright/test';
import actionsFactory from '../../actions';

let actions, auth, posts, token;

test.beforeEach(async ({ request }) => {
  actions = actionsFactory(request);
  auth = actions.auth.auth;
  posts = actions.posts.posts;

  const userPayload = {
    name: 'Post Test',
    email: 'post.test@example.com',
    password: 'password',
  };

  await auth.signup(userPayload);

  const responseSignin = await auth.signin({
    email: userPayload.email,
    password: userPayload.password,
  });

  const responseSigninJson = await responseSignin.json();

  token = responseSigninJson.accessToken;
});

test.describe('Create Post', () => {
  test('should be able to create post', async ({ request }) => {
    test.setTimeout(60 * 1000);

    const postPayload = {
      title: 'Post Test',
      content: 'Post Content',
      authorId: 1,
      type: 'PUBLIC',
      status: 'ACTIVE',
    };

    const response = await posts.createPost({
      data: postPayload,
      token: token,
    });

    const responseJson = await response.json();

    expect(response.status()).toBe(201);
    expect(responseJson.title).toBe(postPayload.title);
    expect(responseJson.content).toBe(postPayload.content);
    expect(responseJson.authorId).toBe(postPayload.authorId);
    expect(responseJson.type).toBe(postPayload.type);
    expect(responseJson.status).toBe(postPayload.status);
  });

  test('should not be able to create post with invalid token', async ({
    request,
  }) => {
    test.setTimeout(60 * 1000);

    const postPayload = {
      title: 'Post Test',
      content: 'Post Content',
      authorId: 1,
      type: 'PUBLIC',
      status: 'ACTIVE',
    };

    const response = await posts.createPost({
      data: postPayload,
      token: 'invalid.token',
    });

    expect(response.status()).toBe(401);
  });

  test('should not be able to create post without title', async ({
    request,
  }) => {
    test.setTimeout(60 * 1000);

    const postPayload = {
      title: '',
      content: 'Post Content',
      authorId: 1,
      type: 'PUBLIC',
      status: 'ACTIVE',
    };

    const response = await posts.createPost({
      data: postPayload,
      token: token,
    });

    const responseJson = await response.json();

    expect(response.status()).toBe(400);
    const messages = responseJson.message;
    expect(Array.isArray(messages)).toBeTruthy();
    expect(messages).toContain('title should not be empty');
  });

  test('should not be able to create post without content', async ({
    request,
  }) => {
    test.setTimeout(60 * 1000);

    const postPayload = {
      title: 'Post Test',
      content: '',
      authorId: 1,
      type: 'PUBLIC',
      status: 'ACTIVE',
    };

    const response = await posts.createPost({
      data: postPayload,
      token,
    });

    const responseJson = await response.json();

    expect(response.status()).toBe(400);
    const messages = responseJson.message;
    expect(Array.isArray(messages)).toBeTruthy();
    expect(messages).toContain('content should not be empty');
  });

  test('should not be able to create post without authorId', async ({
    request,
  }) => {
    test.setTimeout(60 * 1000);

    const postPayload = {
      title: 'Post Test',
      content: 'Post Content',
      authorId: null,
      type: 'PUBLIC',
      status: 'ACTIVE',
    };

    const response = await posts.createPost({
      data: postPayload,
      token,
    });

    const responseJson = await response.json();

    expect(response.status()).toBe(400);
    const messages = responseJson.message;
    expect(Array.isArray(messages)).toBeTruthy();
    expect(messages).toContain('authorId should not be empty');
    expect(messages).toContain('authorId must be an integer number');
  });

  test('should not be able to create post with invalid type', async ({
    request,
  }) => {
    test.setTimeout(60 * 1000);

    const postPayload = {
      title: 'Post Test',
      content: 'Post Content',
      authorId: 1,
      type: 'INVALID_TYPE',
      status: 'ACTIVE',
    };

    const response = await posts.createPost({
      data: postPayload,
      token,
    });

    const responseJson = await response.json();

    expect(response.status()).toBe(400);
    const messages = responseJson.message;
    expect(Array.isArray(messages)).toBeTruthy();
    expect(messages).toContain('Type must be one of: PUBLIC, PRIVATE');
  });

  test('should not be able to create post with invalid status', async ({
    request,
  }) => {
    test.setTimeout(60 * 1000);

    const postPayload = {
      title: 'Post Test',
      content: 'Post Content',
      authorId: 1,
      type: 'PUBLIC',
      status: 'INVALID_STATUS',
    };

    const response = await posts.createPost({
      data: postPayload,
      token,
    });

    const responseJson = await response.json();

    expect(response.status()).toBe(400);
    const messages = responseJson.message;
    expect(Array.isArray(messages)).toBeTruthy();
    expect(messages).toContain('Status must be one of: ACTIVE, INACTIVE');
  });
});

test.describe('List and read posts', () => {
  test('should list only public active posts', async ({ request }) => {
    test.setTimeout(60 * 1000);

    // Create a mix of posts
    const create = (data) => posts.createPost({ data, token });

    const publicActive = {
      title: 'Public Active 1',
      content: 'Public Active Content',
      authorId: 1,
      type: 'PUBLIC',
      status: 'ACTIVE',
    };
    const privateActive = {
      title: 'Private Active',
      content: 'Private Active Content',
      authorId: 1,
      type: 'PRIVATE',
      status: 'ACTIVE',
    };
    const publicInactive = {
      title: 'Public Inactive',
      content: 'Public Inactive Content',
      authorId: 1,
      type: 'PUBLIC',
      status: 'INACTIVE',
    };

    await Promise.all([
      create(publicActive),
      create(privateActive),
      create(publicInactive),
    ]);

    const response = await posts.getPublicPosts();
    const json = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(json)).toBeTruthy();
    expect(json.find((p) => p.title === publicActive.title)).toBeTruthy();
    expect(json.find((p) => p.title === privateActive.title)).toBeFalsy();
    expect(json.find((p) => p.title === publicInactive.title)).toBeFalsy();
  });

  test('should get public active post by id without token', async () => {
    const createRes = await posts.createPost({
      data: {
        title: 'Public Active Readable',
        content: 'Public Active Readable Content',
        authorId: 1,
        type: 'PUBLIC',
        status: 'ACTIVE',
      },
      token,
    });
    const created = await createRes.json();

    const res = await posts.getPostById({ id: created.id });
    const json = await res.json();

    expect(res.status()).toBe(200);
    expect(json.id).toBe(created.id);
  });

  test('should require auth for private/inactive post by id', async () => {
    const createRes = await posts.createPost({
      data: {
        title: 'Private Inactive Read',
        content: 'Private Inactive Read Content',
        authorId: 1,
        type: 'PRIVATE',
        status: 'INACTIVE',
      },
      token,
    });
    const created = await createRes.json();

    const resNoToken = await posts.getPostById({ id: created.id });
    expect(resNoToken.status()).toBe(401);

    const resWithToken = await posts.getPostById({ id: created.id, token });
    expect(resWithToken.status()).toBe(200);
  });
});

test.describe('Search posts', () => {
  test('anonymous sees only public active', async () => {
    await posts.createPost({
      data: {
        title: 'Search Public Active',
        content: 'Search Public Active Content',
        authorId: 1,
        type: 'PUBLIC',
        status: 'ACTIVE',
      },
      token,
    });
    await posts.createPost({
      data: {
        title: 'Search Private Inactive',
        content: 'Search Private Inactive Content',
        authorId: 1,
        type: 'PRIVATE',
        status: 'INACTIVE',
      },
      token,
    });

    const resAnon = await posts.searchPosts({ title: 'Search' });
    const jsonAnon = await resAnon.json();
    expect(resAnon.status()).toBe(200);
    expect(
      jsonAnon.find((p) => p.title === 'Search Public Active'),
    ).toBeTruthy();
    expect(
      jsonAnon.find((p) => p.title === 'Search Private Inactive'),
    ).toBeFalsy();
  });

  test('authenticated sees all posts including private/inactive from any author', async () => {
    // Create a second user for testing posts from different author
    const secondUserPayload = {
      name: 'Second User',
      email: 'second.user@example.com',
      password: 'password',
    };

    await auth.signup(secondUserPayload);
    const secondUserSignin = await auth.signin({
      email: secondUserPayload.email,
      password: secondUserPayload.password,
    });
    const secondUserSigninJson = await secondUserSignin.json();
    const secondUserToken = secondUserSigninJson.accessToken;

    // Create posts for this test as the authenticated user
    await posts.createPost({
      data: {
        title: 'Search Public Active',
        content: 'Search Public Active Content',
        authorId: 1,
        type: 'PUBLIC',
        status: 'ACTIVE',
      },
      token,
    });

    await posts.createPost({
      data: {
        title: 'Search Private Inactive',
        content: 'Search Private Inactive Content',
        authorId: 1,
        type: 'PRIVATE',
        status: 'INACTIVE',
      },
      token,
    });

    // Create a post from the second user
    await posts.createPost({
      data: {
        title: 'Search Other Author Private',
        content: 'Search Other Author Private Content',
        authorId: 2,
        type: 'PRIVATE',
        status: 'INACTIVE',
      },
      token: secondUserToken,
    });

    const resAuth = await posts.searchPosts({
      title: 'Search',
      token,
    });
    const jsonAuth = await resAuth.json();

    expect(resAuth.status()).toBe(200);

    // Should see all posts regardless of author
    expect(
      jsonAuth.find((p) => p.title === 'Search Private Inactive'),
    ).toBeTruthy();
    expect(
      jsonAuth.find((p) => p.title === 'Search Public Active'),
    ).toBeTruthy();
    expect(
      jsonAuth.find((p) => p.title === 'Search Other Author Private'),
    ).toBeTruthy();
  });
});

test.describe('Update and delete posts', () => {
  test('should update post with auth', async () => {
    const createRes = await posts.createPost({
      data: {
        title: 'To Update',
        content: 'Old Content',
        authorId: 1,
        type: 'PUBLIC',
        status: 'ACTIVE',
      },
      token,
    });
    const created = await createRes.json();

    const updateRes = await posts.updatePost({
      id: created.id,
      data: {
        title: 'Updated',
        content: 'New Content',
        type: 'PUBLIC',
        status: 'ACTIVE',
      },
      token,
    });
    const updated = await updateRes.json();
    expect(updateRes.status()).toBe(200);
    expect(updated.title).toBe('Updated');
    expect(updated.content).toBe('New Content');
  });

  test('delete only works when inactive', async () => {
    const createRes = await posts.createPost({
      data: {
        title: 'To Delete',
        content: 'To Delete Content',
        authorId: 1,
        type: 'PUBLIC',
        status: 'ACTIVE',
      },
      token,
    });
    const created = await createRes.json();

    // Try delete while ACTIVE
    const delActive = await posts.deletePost({ id: created.id, token });
    expect(delActive.status()).toBe(400);

    // Set to INACTIVE and delete
    await posts.updatePost({
      id: created.id,
      data: { status: 'INACTIVE' },
      token,
    });

    const delInactive = await posts.deletePost({ id: created.id, token });
    const delJson = await delInactive.json();
    expect(delInactive.status()).toBe(200);
    expect(delJson.message).toBe('Post deleted successfully');
  });
});
