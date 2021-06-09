let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Index', () => {

    describe('/GET index', () => {
        it('it should GET 404 not found', (done) => {
            chai.request(app)
                .get('/v1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

})