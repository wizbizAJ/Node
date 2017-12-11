(function () {
  'use strict';

  describe('Campaign_types Admin Controller Tests', function () {
    // Initialize global variables
    var Campaign_typesAdminController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      Campaign_typesService,
      mockCampaign_type,
      Notification;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _Campaign_typesService_, _Notification_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      Campaign_typesService = _Campaign_typesService_;
      Notification = _Notification_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock campaign_type
      mockCampaign_type = new Campaign_typesService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Campaign_type about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Campaign_types controller.
      Campaign_typesAdminController = $controller('Campaign_typesAdminController as vm', {
        $scope: $scope,
        campaign_typeResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
      spyOn(Notification, 'error');
      spyOn(Notification, 'success');
    }));

    describe('vm.save() as create', function () {
      var sampleCampaign_typePostData;

      beforeEach(function () {
        // Create a sample campaign_type object
        sampleCampaign_typePostData = new Campaign_typesService({
          title: 'An Campaign_type about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.campaign_type = sampleCampaign_typePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Campaign_typesService) {
        // Set POST response
        $httpBackend.expectPOST('/api/campaign_types', sampleCampaign_typePostData).respond(mockCampaign_type);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign_type saved successfully!' });
        // Test URL redirection after the campaign_type was created
        expect($state.go).toHaveBeenCalledWith('admin.campaign_types.list');
      }));

      it('should call Notification.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('/api/campaign_types', sampleCampaign_typePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Campaign_type save error!' });
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock campaign_type in $scope
        $scope.vm.campaign_type = mockCampaign_type;
      });

      it('should update a valid campaign_type', inject(function (Campaign_typesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/campaign_types\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign_type saved successfully!' });
        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.campaign_types.list');
      }));

      it('should  call Notification.error if error', inject(function (Campaign_typesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/campaign_types\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Campaign_type save error!' });
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup campaign_types
        $scope.vm.campaign_type = mockCampaign_type;
      });

      it('should delete the campaign_type and redirect to campaign_types', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/campaign_types\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign_type deleted successfully!' });
        expect($state.go).toHaveBeenCalledWith('admin.campaign_types.list');
      });

      it('should should not delete the campaign_type and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
