'use strict';

describe('Character_types E2E Tests:', function () {
  describe('Test character_types page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/character_types');
      expect(element.all(by.repeater('character_type in character_types')).count()).toEqual(0);
    });
  });
});
