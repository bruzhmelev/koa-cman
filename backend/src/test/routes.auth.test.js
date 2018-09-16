require('dotenv').config();
process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../server');

const port = 4003;
const server = app.listen(port, () =>
  console.log(`API server started on ${port}`)
);

describe('routes : auth', () => {
  beforeEach(() => {
    // prepare data
  });

  describe('POST /v1/auth/localregister', () => {
    it('should not register exist user', done => {
      chai
        .request(server)
        .post('/v1/auth/localregister')
        .send({
          username: 'testUser',
          password: 'testPass'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(404, 'response status should be 404');
          done();
        });
    });

    it('should register a new user', done => {
      chai
        .request(server)
        .post('/v1/auth/localregister')
        .send({
          username: 'testUserNew',
          password: 'testPassNew'
        })
        .end((err, res) => {
          should.not.exist(err);
          console.log(JSON.stringify(res));
          res.status.should.equal(200, 'response status should be 200');
          done();
        });
    });

    describe('POST /v1/auth/login', () => {
      it('should login a user', done => {
        // arrange
        chai
          .request(server)
          .post('/v1/auth/localregister')
          .send({
            username: 'testUserNew2',
            password: 'testPassNew2'
          })
          .end(() => {
            // act
            chai
              .request(server)
              .post('/v1/auth/login')
              .send({
                username: 'testUserNew2',
                password: 'testPassNew2'
              })
              .end((err, res) => {
                console.log(JSON.stringify(res));
                res.status.should.equals(200);
                res.text.should.contains('"username":"testUserNew2"');
                done();
              });
          });
      });

      it('shouldn`t login a not existed user', done => {
        // act
        chai
          .request(server)
          .post('/v1/auth/login')
          .send({
            username: 'notexisted',
            password: 'notexisted'
          })
          .end((err, res) => {
            console.log(JSON.stringify(res));
            res.status.should.equals(404);
            res.text.should.contains('"message":"Пользователь не существует"');
            done();
          });
      });
    });
  });

  afterEach(() => {
    // dispose all
  });
});
