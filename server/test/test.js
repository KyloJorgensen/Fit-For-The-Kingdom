var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
chai.use(chaiHttp);

describe('Fit For The Kingdom', function() {
    it('should list of users on GET', function(done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                // res.should.have.status(200);
                // res.should.be.json;
                // res.body.should.be.a('array');
                // res.body.should.have.length(3);
                // res.body[0].should.be.a('object');
                // res.body[0].should.have.property('id');
                // res.body[0].should.have.property('name');
                // res.body[0].id.should.be.a('number');
                // res.body[0].name.should.be.a('string');
                // res.body[0].name.should.equal('Broad beans');
                // res.body[1].name.should.equal('Tomatoes');
                // res.body[2].name.should.equal('Peppers');
                done();
            });
    });
});