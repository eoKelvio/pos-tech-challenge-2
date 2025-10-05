import { expect, test } from '@playwright/test';
import actionsFactory from '../../actions';

let actions, auth;

test.beforeEach(async ({ request }) => {
  actions = actionsFactory(request);
  auth = actions.auth.auth;
});

test.describe('Authentication', () => {
  test('should be able to signup', async ({ request }) => {
    test.setTimeout(60 * 1000);

    const userPayload = {
      name: 'Signup Test',
      email: 'signup.test@example.com',
      password: 'password',
    };

    const response = await auth.signup(userPayload);

    const responseJson = await response.json();

    expect(response.status()).toBe(201);
    expect(responseJson.name).toBe(userPayload.name);
    expect(responseJson.email).toBe(userPayload.email);
    expect(responseJson.password).toBeUndefined();
  });

  test('should not be able to signup with existing email', async ({ request }) => {
    test.setTimeout(60 * 1000);
  
    const userPayload = {
      name: 'Signup Test Existing Email',
      email: 'signup.test.existing.email@example.com',
      password: 'password',
    };
  
    await auth.signup(userPayload);

    const response = await auth.signup(userPayload);

    expect(response.status()).toBe(401);
  });

  test('should be able to signin', async ({ request }) => {
    test.setTimeout(60 * 1000);

    const userPayload = {
      name: 'Signin Test',
      email: 'signin.test@example.com',
      password: 'password',
    };

    await auth.signup(userPayload);

    const responseSignin = await auth.signin({
      email: userPayload.email,
      password: userPayload.password,
    });

    const responseSigninJson = await responseSignin.json();

    expect(responseSignin.status()).toBe(201);
    expect(responseSigninJson.accessToken).toBeDefined();
  });

  test('should not be able to signin with invalid credentials', async ({ request }) => {
    test.setTimeout(60 * 1000);

    const email = 'invalid.email@example.com';
    const password = 'password';

    const response = await auth.signin({
      email,
      password,
    });

    expect(response.status()).toBe(401);  
  });

  test('should be able to get me', async ({ request }) => {
    test.setTimeout(60 * 1000);

    const userPayload = {
      name: 'Get Me Test',
      email: 'get.me.test@example.com',
      password: 'password',
    };

    await auth.signup(userPayload);

    const responseSignin = await auth.signin({
      email: userPayload.email,
      password: userPayload.password,
    });

    const responseSigninJson = await responseSignin.json();

    const responseGetMe = await auth.getMe(responseSigninJson.accessToken);

    const responseGetMeJson = await responseGetMe.json();

    expect(responseGetMe.status()).toBe(200);
    expect(responseGetMeJson.name).toBe(userPayload.name);
    expect(responseGetMeJson.email).toBe(userPayload.email);
    expect(responseGetMeJson.password).toBeUndefined();
  });

  test('should not be able to get me with invalid token', async ({ request }) => {
    test.setTimeout(60 * 1000);

    const response = await auth.getMe('invalid.token');

    expect(response.status()).toBe(401);
  })
});
