(function () {
  'use strict';

  describe('Departments Route Tests', function () {
    // Initialize global variables
    var $scope,
      DepartmentsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DepartmentsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DepartmentsService = _DepartmentsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('departments');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/departments');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('departments.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/departments/client/views/list-departments.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          DepartmentsController,
          mockDepartment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('departments.view');
          $templateCache.put('/modules/departments/client/views/view-department.client.view.html', '');

          // create mock department
          mockDepartment = new DepartmentsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Department about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          DepartmentsController = $controller('DepartmentsController as vm', {
            $scope: $scope,
            departmentResolve: mockDepartment
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:departmentId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.departmentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            departmentId: 1
          })).toEqual('/departments/1');
        }));

        it('should attach an department to the controller scope', function () {
          expect($scope.vm.department._id).toBe(mockDepartment._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/departments/client/views/view-department.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/departments/client/views/list-departments.client.view.html', '');

          $state.go('departments.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('departments/');
          $rootScope.$digest();

          expect($location.path()).toBe('/departments');
          expect($state.current.templateUrl).toBe('/modules/departments/client/views/list-departments.client.view.html');
        }));
      });
    });
  });
}());
