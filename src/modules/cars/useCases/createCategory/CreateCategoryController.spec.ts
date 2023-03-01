import { app } from '@shared/infra/http/app';
import request from 'supertest';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import createConnection from '@shared/infra/typeorm';
import { Connection } from 'typeorm';

let connection: Connection;
describe('Create Category Controller', () => {
    beforeAll(async () => {
        connection = await createConnection();

        /* tabela user precisa estar criada antes de ser inserida a query */
        await connection.runMigrations();

        const id = uuid();
        const password = await hash('admin', 8);

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license ) 
          values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX')
        `,
        );
    });

    afterAll(async () => {
        /* apaga as tabelas criadas e depois encerra a conexão */
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be able to create a new Category', async () => {
        const responseToken = await request(app).post('/sessions').send({
            email: 'admin@rentx.com.br',
            password: 'admin',
        });

        const { token } = responseToken.body;

        const response = await request(app)
            .post('/categories')
            .send({
                name: 'Category Supertest',
                description: 'Category Supertest',
            })
            .set({
                Authorization: `Bearer ${token}`,
            });
        expect(response.status).toBe(201);
    });

    /* Será usada a mesma instância de categoria , pq está usando beforeAll e não beforeEach */
    it('should not be able to create a new category with name exists', async () => {
        const responseToken = await request(app).post('/sessions').send({
            email: 'admin@rentx.com.br',
            password: 'admin',
        });

        const { token } = responseToken.body;

        const response = await request(app)
            .post('/categories')
            .send({
                name: 'Category Supertest',
                description: 'Category Supertest',
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.status).toBe(400);
    });
});
