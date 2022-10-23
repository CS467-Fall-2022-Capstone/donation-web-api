import { expect } from 'chai';
import request from 'supertest';
import setupDb from './testConfig.js';
import app from '../src/express.js';

describe('POST: /auth/signup route to insert data', () => {
    setupDb(); // setup DB

    it('valid data', (done) => {
        // test case 1
        let toSendData = {
            name: 'John Doe',
            email: 'doejohn@testemail.com',
            password: 'somepwd123',
        };
        request(app)
            .post('/auth/signup')
            .send(toSendData)
            .then((res) => {
                expect(res.statusCode).to.equal(201);
                expect(res.body).to.have.property('token');
                done();
            })
            .catch((err) => done(err));
    });

    it('no email field given', (done) => {
        // test case 2
        request(app)
            .post('/auth/signup')
            .send({ name: 'John Doe', password: 'somepwd123' })
            .then((res) => {
                expect(res.statusCode).to.equal(400);
                expect(res.body).to.be.an('object');
                done();
            })
            .catch((err) => done(err));
    });
});