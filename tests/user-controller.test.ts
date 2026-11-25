// tests/user-controller.test.ts
import {test, expect} from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    test('find user: should return a user by ID', async ({request}) => {
        const createResponse = await request.post(`${baseURL}`);
        const userCreated = await createResponse.json();
        const userID = userCreated.id;
        const response = await request.get(`${baseURL}/${userID}`);
        expect(response.status()).toBe(StatusCodes.OK)
    });

    test('find user: should return 404 if user not found', async ({request}) => {
        const response = await request.get(`${baseURL}/101`);
        expect(response.status()).toBe(StatusCodes.NOT_FOUND)

        // always more than 100, id>100
    });

    test('create user: should add a new user', async ({request}) => {
        const createResponse = await request.post(`${baseURL}`);
        expect(createResponse.status()).toBe(StatusCodes.CREATED);
    });

    test('delete user: should delete a user by ID', async ({request}) => {
        const createResponse = await request.post(`${baseURL}`);
        const userCreated = await createResponse.json();
        const userID = userCreated.id;
        const deleteCreated = await request.delete(`${baseURL}/${userID}`);
        expect(deleteCreated.status()).toBe(StatusCodes.OK);
        const getResponse = await request.get(`${baseURL}/${userID}`);
        expect(getResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });

    test('delete user: should return 404 if user not found', async ({request}) => {
        const response = await request.delete(`${baseURL}/101`);
        expect(response.status()).toBe(StatusCodes.NOT_FOUND)
    });


});
