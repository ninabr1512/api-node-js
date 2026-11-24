// tests/user-controller.test.ts
import {test, expect} from '@playwright/test';

let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {
    const cleanupUsers = async (request: any): Promise<void> => {
        const response = await request.get(`${baseURL}`);
        const users: Array<any> = await response.json();

        let i = 0;
        for (i; i < users.length; i = i + 1) {
            await request.delete(`${baseURL}/${users[i].id}`)
        }
        console.log(`Removed: ${i + 1} users`);
    }

    test('all users: should return empty array when no users', async ({request}) => {
        await cleanupUsers(request);
        const responseAfterCleanup = await request.get(`${baseURL}`);
        const usersAfterCleanUp = await responseAfterCleanup.json();
        expect(usersAfterCleanUp.length).toBe(0);
    });

    test('find user: should return a user by ID', async ({request}) => {
        const createResponse = await request.post(`${baseURL}`);
        const userCreated = await createResponse.json();
        const userID = userCreated.id;
        const response = await request.get(`${baseURL}/${userID}`);
        console.log(await response.text());
        expect(response.status()).toBe(200)
    });

    test('find user: should return 404 if user not found', async ({request}) => {
        const response = await request.get(`${baseURL}/101`);
        expect(response.status()).toBe(404)

        // always more then 100, id>100
    });

    test('create user: should add a new user', async ({request}) => {
        const createResponse = await request.post(`${baseURL}`);
        console.log(createResponse.status());
        expect(createResponse.status()).toBe(201);
    });

    test('delete user: should delete a user by ID', async ({request}) => {
        const createResponse = await request.post(`${baseURL}`);
        const userCreated = await createResponse.json();
        const userID = userCreated.id;
        const deleteCreated = await request.delete(`${baseURL}/${userID}`);
        expect(deleteCreated.status()).toBe(200);
        const getResponse = await request.get(`${baseURL}/${userID}`);
        expect(getResponse.status()).toBe(404);
    });

    test('delete user: should return 404 if user not found', async ({request}) => {
        const response = await request.delete(`${baseURL}/101`);
        expect(response.status()).toBe(404)
    });


});
