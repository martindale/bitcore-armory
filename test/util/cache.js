'use strict';

var should = require('chai').should();
var cache = require('../../lib/util/cache');

var key = 'test';
var secondKey = 'second';

describe('Cache', function() {
  describe('uninitialized', function() {
    beforeEach(function() {
      cache.resetAll();
    });

    it('should have a length of 0', function() {
      cache.length(key).should.equal(0);
    });

    it('should not retrieve any value', function() {
      should.not.exist(cache.get(key, 0));
      should.not.exist(cache.get(key, 1));
      should.not.exist(cache.get(key, 2));
    });

    it('should return an empty array for any slice', function() {
      cache.slice(key, 0, 1).should.have.length(0);
      cache.slice(key, 0, 5).should.have.length(0);
    });

    it('should allow a new element', function() {
      cache.push(key, 'first value');

      cache.length(key).should.equal(1);
      cache.get(key, 0).should.equal('first value');
      cache.slice(key, 0, 1).should.have.length(1);
      cache.slice(key, 0, 5).should.have.length(1);
    });

    it('should allow reset', function() {
      cache.reset(key);

      cache.length(key).should.equal(0);
      should.not.exist(cache.get(key, 0));
      cache.slice(key, 0, 1).should.have.length(0);
      cache.slice(key, 0, 5).should.have.length(0);
    });
  });

  describe('with a single value', function() {
    beforeEach(function() {
      cache.resetAll();
      cache.push(key, 'first value');
    });

    it('should have a length of 1', function() {
      cache.length(key).should.equal(1);
    });

    it('should retrieve the value', function() {
      cache.get(key, 0).should.equal('first value');
    });

    it('should not retrieve any other values', function() {
      should.not.exist(cache.get(key, 1));
      should.not.exist(cache.get(key, 2));
    });

    it('should return a single element array', function() {
      cache.slice(key, 0, 1).should.have.length(1);
      cache.slice(key, 0, 5).should.have.length(1);
    });

    it('should return an empty array', function() {
      cache.slice(key, 1, 1).should.have.length(0);
      cache.slice(key, 1, 5).should.have.length(0);
    });

    it('should allow a new element', function() {
      cache.push(key, 'second value');

      cache.length(key).should.equal(2);
      cache.get(key, 0).should.equal('first value');
      cache.get(key, 1).should.equal('second value');
      cache.slice(key, 0, 1).should.have.length(1);
      cache.slice(key, 0, 5).should.have.length(2);
      cache.slice(key, 1, 2).should.have.length(1);
    });

    it('should allow reset', function() {
      cache.reset(key);

      cache.length(key).should.equal(0);
      should.not.exist(cache.get(key, 0));
      cache.slice(key, 0, 1).should.have.length(0);
      cache.slice(key, 0, 5).should.have.length(0);
    });
  });

  describe('with multiple values', function() {
    beforeEach(function() {
      cache.resetAll();
      cache.push(key, 'first value');
      cache.push(key, 'second value');
      cache.push(key, 'third value');
      cache.push(key, 'fourth value');
    });

    it('should have a length of 4', function() {
      cache.length(key).should.equal(4);
    });

    it('should retrieve each value', function() {
      cache.get(key, 0).should.equal('first value');
      cache.get(key, 3).should.equal('fourth value');
      cache.get(key, 1).should.equal('second value');
      cache.get(key, 2).should.equal('third value');
    });

    it('should not retrieve any other values', function() {
      should.not.exist(cache.get(key, -1));
      should.not.exist(cache.get(key, 4));
    });

    it('should return correct slices', function() {
      cache.slice(key, 0, 1).should.have.length(1);
      cache.slice(key, 0, 2).should.have.length(2);
      cache.slice(key, 0, 4).should.have.length(4);
      cache.slice(key, 0, 5).should.have.length(4);
      cache.slice(key, 1, 1).should.have.length(0);
      cache.slice(key, 1, 2).should.have.length(1);
      cache.slice(key, 1, 5).should.have.length(3);
      cache.slice(key, 4, 5).should.have.length(0);
    });
  });

  describe('with multiple keys', function() {
    beforeEach(function() {
      cache.resetAll();
      cache.push(key, 'first value');
      cache.push(key, 'second value');
      cache.push(secondKey, '1st value on 2nd key');
      cache.push(secondKey, '2nd value on 2nd key');
      cache.push(key, 'third value');
      cache.push(secondKey, '3rd value on 2nd key');
      cache.push(key, 'fourth value');
    });

    it('should have a correct lengths', function() {
      cache.length(key).should.equal(4);
      cache.length(secondKey).should.equal(3);
    });

    it('should retrieve each value', function() {
      cache.get(secondKey, 2).should.equal('3rd value on 2nd key');
      cache.get(key, 0).should.equal('first value');
      cache.get(key, 3).should.equal('fourth value');
      cache.get(secondKey, 0).should.equal('1st value on 2nd key');
      cache.get(key, 1).should.equal('second value');
      cache.get(secondKey, 1).should.equal('2nd value on 2nd key');
      cache.get(key, 2).should.equal('third value');
    });

    it('should not retrieve any other values', function() {
      should.not.exist(cache.get(key, -1));
      should.not.exist(cache.get(key, 4));
      should.not.exist(cache.get(secondKey, -1));
      should.not.exist(cache.get(secondKey, 3));
    });

    it('should return correct slices', function() {
      cache.slice(key, 0, 1).should.have.length(1);
      cache.slice(key, 0, 4).should.have.length(4);
      cache.slice(key, 1, 2).should.have.length(1);
      cache.slice(key, 1, 5).should.have.length(3);
      cache.slice(key, 4, 5).should.have.length(0);
      cache.slice(secondKey, 0, 1).should.have.length(1);
      cache.slice(secondKey, 0, 2).should.have.length(2);
      cache.slice(secondKey, 0, 4).should.have.length(3);
      cache.slice(secondKey, 0, 5).should.have.length(3);
      cache.slice(secondKey, 1, 1).should.have.length(0);
      cache.slice(secondKey, 1, 2).should.have.length(1);
      cache.slice(secondKey, 1, 5).should.have.length(2);
      cache.slice(secondKey, 3, 5).should.have.length(0);
    });

    it('should allow reset on a specific key', function() {
      cache.reset(key);

      cache.length(key).should.equal(0);
      should.not.exist(cache.get(key, 0));
      cache.slice(key, 0, 1).should.have.length(0);
      cache.slice(key, 0, 5).should.have.length(0);

      cache.length(secondKey).should.equal(3);
      cache.get(secondKey, 1).should.equal('2nd value on 2nd key');
      cache.slice(secondKey, 0, 1).should.have.length(1);
      cache.slice(secondKey, 0, 5).should.have.length(3);
    });
  });

});
