const {describe, it} = (exports.lab = require('lab').script());
const expect = require('code').expect;
const Parser = require('../../src/Parser');

describe('Parser Class', () => {
  describe('Creating Parse with string', () => {
    it('should work', (done) => {
      const parser = new Parser('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; InfoPath.1)');

      expect(parser).to.be.instanceOf(Parser);

      expect(parser.isBrowser('Internet Explorer', '=', '6.0')).to.be.true();
      done();
    });
  });

  describe('Creating Parse with headers object', () => {
    it('should work', (done) => {
      const parser = new Parser({'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; InfoPath.1)'});

      expect(parser).to.be.instanceOf(Parser);

      expect(parser.isBrowser('Internet Explorer', '=', '6.0')).to.be.true();
      done();
    });
  });

  describe('Creating Parse with options', () => {
    it('should work', (done) => {
      const parser = new Parser({
        headers: {'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; InfoPath.1)'},
      });

      expect(parser).to.be.instanceOf(Parser);

      expect(parser.isBrowser('Internet Explorer', '=', '6.0')).to.be.true();
      done();
    });
  });

  describe('Creating Parse without arguments', () => {
    it('an calling analyse should work', (done) => {
      const parser = new Parser();
      parser.analyse('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; InfoPath.1)');

      expect(parser).to.be.instanceOf(Parser);

      expect(parser.isBrowser('Internet Explorer', '=', '6.0')).to.be.true();
      done();
    });
  });
});
