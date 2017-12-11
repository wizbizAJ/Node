(function () {
  'use strict';

  describe('Admin Campaign_types List Controller Tests', function () {
    // Initialize global variables
    var Campaign_typesAdminListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      Campaign_typesService,
      mockCampaign_type;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _Campaign_typesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      Campaign_typesService = _Campaign_typesService_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/campaign_types/client/views/list-campaign_types.client.view.html').respond(200, '');
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock campaign_type
      mockCampaign_type = new Campaign_typesService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Campaign_type about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user', 'admin']
      };

      // Initialize the Campaign_types List controller.
      Campaign_typesAdminListController = $controller('Campaign_typesAdminListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockCampaign_typeList;

      beforeEach(function () {
        mockCampaign_typeList = [mockCampaign_type, mockCampaign_type];
      });

      it('should send a GET request and return all campaign_types', inject(function (Campaign_typesService) {
        // Set POST response
        $httpBackend.expectGET('/api/campaign_types').respond(mockCampaign_typeList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.campaign_types.length).toEqual(2);
        expect($scope.vm.campaign_types[0]).toEqual(mockCampaign_type);
        expect($scope.vm.campaign_types[1]).toEqual(mockCampaign_type);

      }));
    });
  });
}());
