'use strict';

describe('Campaign_types E2E Tests:', function () {
  describe('Test campaign_types page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/campaign_types');
      expect(element.all(by.repeater('campaign_type in campaign_types')).count()).toEqual(0);
    });
  });
});
