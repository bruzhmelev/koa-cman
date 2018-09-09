require('dotenv').config();
process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../server');

const port = 4003;
const app = server.listen(port, () =>
  console.log(`API server started on ${port}`)
);

describe('routes : auth', () => {
  beforeEach(() => {
    // prepare data
  });

  describe('POST /auth/localregister', () => {
    it('should not register exist user', done => {
      chai
        .request(app)
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
        .request(app)
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
  });

  afterEach(() => {
    // dispose all
  });
});
