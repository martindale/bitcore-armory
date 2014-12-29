'use strict';

require('chai').should();
var easy16 = require('../../lib/util/easy16');

describe('Easy16', function() {
  it('should decode basic string', function() {
    easy16.decode('asdfghjkwertuion').should.equal('0123456789ABCDEF');
  });

  it('should decode basic string with spaces', function() {
    easy16.decode('asdf ghjk\n\twert uion').should.equal('0123456789ABCDEF');
  });

  it('should decode watch only root id', function() {
    easy16.decode('wsfg akeu uufk aasw te').should.equal('8134079CCC370018B9');
  });

  it('should decode watch only root data', function() {
    easy16.decode('dnjs wkjw tdkh iihn ujtn dukw jtwu dfnk akht\r\n' +
      'htwt ktut nuej uhuf jant ftka feir deji dafj\r\n' +
      'sekd wtni ugnu kidf sths swht etsa jhnj hdit\r\n' +
      'wfff sgan noaj foui gdsa wrks sjgu kkjh nfja\r\n')
    .should.equal(
      '2F618768B275DD5FC6BF2C786B8C23F7075B' +
      '5B8B7BCBFC96C5C360FB3B7039DA296D2036' +
      '19728BFDC4FC7D231B51185B9B1065F652DB' +
      '8333140FFE063ECD42108A71164C7765F360');
  });

  it('should encode basic string', function() {
    easy16.encode('0123456789ABCDEF').should.equal('asdfghjkwertuion');
  });

  it('should encode basic lowercase string', function() {
    easy16.encode('0123456789abcdef').should.equal('asdfghjkwertuion');
  });

  it('should encode basic string with spaces', function() {
    easy16.encode('0123 4567\n\t89AB CDEF').should.equal('asdfghjkwertuion');
  });
});
