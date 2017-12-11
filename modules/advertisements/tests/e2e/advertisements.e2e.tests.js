'use strict';

describe('Advertisements E2E Tests:', function () {
  describe('Test advertisements page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/advertisements');
      expect(element.all(by.repeater('advertisement in advertisements')).count()).toEqual(0);
    });
  });
});
