(function () {
  'use strict';

  describe('Departments Admin Controller Tests', function () {
    // Initialize global variables
    var DepartmentsAdminController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      DepartmentsService,
      mockDepartment,
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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _DepartmentsService_, _Notification_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      DepartmentsService = _DepartmentsService_;
      Notification = _Notification_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock department
      mockDepartment = new DepartmentsService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Department about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Departments controller.
      DepartmentsAdminController = $controller('DepartmentsAdminController as vm', {
        $scope: $scope,
        departmentResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
      spyOn(Notification, 'error');
      spyOn(Notification, 'success');
    }));

    describe('vm.save() as create', function () {
      var sampleDepartmentPostData;

      beforeEach(function () {
        // Create a sample department object
        sampleDepartmentPostData = new DepartmentsService({
          title: 'An Department about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.department = sampleDepartmentPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (DepartmentsService) {
        // Set POST response
        $httpBackend.expectPOST('/api/departments', sampleDepartmentPostData).respond(mockDepartment);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Department saved successfully!' });
        // Test URL redirection after the department was created
        expect($state.go).toHaveBeenCalledWith('admin.departments.list');
      }));

      it('should call Notification.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('/api/departments', sampleDepartmentPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Department save error!' });
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock department in $scope
        $scope.vm.department = mockDepartment;
      });

      it('should update a valid department', inject(function (DepartmentsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/departments\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Department saved successfully!' });
        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.departments.list');
      }));

      it('should  call Notification.error if error', inject(function (DepartmentsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/departments\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Department save error!' });
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup departments
        $scope.vm.department = mockDepartment;
      });

      it('should delete the department and redirect to departments', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/departments\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Department deleted successfully!' });
        expect($state.go).toHaveBeenCalledWith('admin.departments.list');
      });

      it('should should not delete the department and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
