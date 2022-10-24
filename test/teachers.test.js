import { expect } from 'chai';
import request from 'supertest';
import setupDb from './testConfig.js';
import app from '../src/express.js';
import Teacher from '../src/models/teacher.model.js';

describe('POST: /auth/signup route to insert data and POST: /api/teachers', () => {
    setupDb(); // setup DB

    // create Jane Doe before each test case
    let teacher;

    beforeEach((done) => {
        teacher = new Teacher({
            name: 'Jane Doe',
            email: 'janedoe@gmail.com',
            password: 'somepwdforjane',
        });
        teacher
            .save()
            .then(() => done())
            .catch((err) => done(err));
    });

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
                expect(res.body.name).to.equal('John Doe');
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

    it('findById returns Jane Doe', (done) => {
        // test case 3
        request(app)
            .post('/auth/login')
            .send({
                email: 'janedoe@gmail.com',
                password: 'somepwdforjane',
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body).to.have.property('token');
                let token = res.body.token;

                request(app)
                    .get(`/api/teachers/${teacher._id}`)
                    .set('Authorization', `bearer ${token}`)
                    .then((res) => {
                        expect(res.body).to.have.property('name');
                        expect(res.body.name).to.equal('Jane Doe');
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

    it("Update Jane Doe's email", (done) => {
        // test case 4
        let newEmail = { email: 'doejane@gmail.com' };
        request(app)
            .post('/auth/login')
            .send({
                email: 'janedoe@gmail.com',
                password: 'somepwdforjane',
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body).to.have.property('token');
                let token = res.body.token;

                request(app)
                    .put(`/api/teachers/${teacher._id}`)
                    .set('Authorization', `bearer ${token}`)
                    .send(newEmail)
                    .then((res) => {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body).to.have.property('email');
                        expect(res.body.email).to.equal(newEmail.email);
                        done();
                    })
                    .catch((err) => done(err));
            });
    });
});
