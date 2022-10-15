const request = require('supertest');
const app = require('./../../app');
//import {app} from './../../app';

describe('Teachers', () => {
    it ('GET /api/teachers --> array teachers', () => {
        return request(app).get('/api/teachers')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body)
                .toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        name: expect.any(String),
                        email: expect.any(String)
                    })
                ]))
            })
    });
    /*
    it ('GET /api/teachers/id --> specific teacher by ID', () => {
        return request(app).get('/api/teachers')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body)
                .toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        name: expect.any(String),
                        email: expect.any(String)
                    })
                ]))
            })
    });
    */
    it ('GET /api/teachers/id --> 404 teacher record not found', () => {
        return request(app).get('/api/teachers/1').expect(404);
    });
    
    it ('POST /api/teachers -- newly created teacher', () => {
        return request(app).post('/api/teachers')
            .send({
                name: "Thor",
                email: "ragnarok@school.edu",
                password: "136abc",
                students: ["Jane"],
                supplies: ["Hammer", "Lighting"]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((resonse) => {
                expect.objectContaining(
                    {
                        "message": "Successfully signed up!"
                    }
                )
            })
    });
    /*
    it('GET /api/teachers --validates request body', () => {});
    */
})

