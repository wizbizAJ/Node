(function () {
  'use strict';

  describe('Character_types Admin Controller Tests', function () {
    // Initialize global variables
    var Character_typesAdminController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      Character_typesService,
      mockCharacter_type,
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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _Character_typesService_, _Notification_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      Character_typesService = _Character_typesService_;
      Notification = _Notification_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock character_type
      mockCharacter_type = new Character_typesService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Character_type about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Character_types controller.
      Character_typesAdminController = $controller('Character_typesAdminController as vm', {
        $scope: $scope,
        character_typeResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
      spyOn(Notification, 'error');
      spyOn(Notification, 'success');
    }));

    describe('vm.save() as create', function () {
      var sampleCharacter_typePostData;

      beforeEach(function () {
        // Create a sample character_type object
        sampleCharacter_typePostData = new Character_typesService({
          title: 'An Character_type about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.character_type = sampleCharacter_typePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Character_typesService) {
        // Set POST response
        $httpBackend.expectPOST('/api/character_types', sampleCharacter_typePostData).respond(mockCharacter_type);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Character_type saved successfully!' });
        // Test URL redirection after the character_type was created
        expect($state.go).toHaveBeenCalledWith('admin.character_types.list');
      }));

      it('should call Notification.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('/api/character_types', sampleCharacter_typePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Character_type save error!' });
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock character_type in $scope
        $scope.vm.character_type = mockCharacter_type;
      });

      it('should update a valid character_type', inject(function (Character_typesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/character_types\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Character_type saved successfully!' });
        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.character_types.list');
      }));

      it('should  call Notification.error if error', inject(function (Character_typesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/character_types\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Character_type save error!' });
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup character_types
        $scope.vm.character_type = mockCharacter_type;
      });

      it('should delete the character_type and redirect to character_types', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/character_types\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Character_type deleted successfully!' });
        expect($state.go).toHaveBeenCalledWith('admin.character_types.list');
      });

      it('should should not delete the character_type and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
