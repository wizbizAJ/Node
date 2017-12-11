﻿(function () {
  'use strict';

  describe('Advertisements Admin Controller Tests', function () {
    // Initialize global variables
    var AdvertisementsAdminController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AdvertisementsService,
      mockAdvertisement,
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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AdvertisementsService_, _Notification_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AdvertisementsService = _AdvertisementsService_;
      Notification = _Notification_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock advertisement
      mockAdvertisement = new AdvertisementsService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Advertisement about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Advertisements controller.
      AdvertisementsAdminController = $controller('AdvertisementsAdminController as vm', {
        $scope: $scope,
        advertisementResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
      spyOn(Notification, 'error');
      spyOn(Notification, 'success');
    }));

    describe('vm.save() as create', function () {
      var sampleAdvertisementPostData;

      beforeEach(function () {
        // Create a sample advertisement object
        sampleAdvertisementPostData = new AdvertisementsService({
          title: 'An Advertisement about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.advertisement = sampleAdvertisementPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (AdvertisementsService) {
        // Set POST response
        $httpBackend.expectPOST('/api/advertisements', sampleAdvertisementPostData).respond(mockAdvertisement);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Advertisement saved successfully!' });
        // Test URL redirection after the advertisement was created
        expect($state.go).toHaveBeenCalledWith('admin.advertisements.list');
      }));

      it('should call Notification.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('/api/advertisements', sampleAdvertisementPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Advertisement save error!' });
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock advertisement in $scope
        $scope.vm.advertisement = mockAdvertisement;
      });

      it('should update a valid advertisement', inject(function (AdvertisementsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/advertisements\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Advertisement saved successfully!' });
        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.advertisements.list');
      }));

      it('should  call Notification.error if error', inject(function (AdvertisementsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/advertisements\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Advertisement save error!' });
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup advertisements
        $scope.vm.advertisement = mockAdvertisement;
      });

      it('should delete the advertisement and redirect to advertisements', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/advertisements\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Advertisement deleted successfully!' });
        expect($state.go).toHaveBeenCalledWith('admin.advertisements.list');
      });

      it('should should not delete the advertisement and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
