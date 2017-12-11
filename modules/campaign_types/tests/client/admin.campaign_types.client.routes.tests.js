(function () {
  'use strict';

  describe('Campaign_types Route Tests', function () {
    // Initialize global variables
    var $scope,
      Campaign_typesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Campaign_typesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Campaign_typesService = _Campaign_typesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.campaign_types');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/campaign_types');
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
          liststate = $state.get('admin.campaign_types.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/campaign_types/client/views/admin/list-campaign_types.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          Campaign_typesAdminController,
          mockCampaign_type;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.campaign_types.create');
          $templateCache.put('/modules/campaign_types/client/views/admin/form-campaign_type.client.view.html', '');

          // Create mock campaign_type
          mockCampaign_type = new Campaign_typesService();

          // Initialize Controller
          Campaign_typesAdminController = $controller('Campaign_typesAdminController as vm', {
            $scope: $scope,
            campaign_typeResolve: mockCampaign_type
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.campaign_typeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/campaign_types/create');
        }));

        it('should attach an campaign_type to the controller scope', function () {
          expect($scope.vm.campaign_type._id).toBe(mockCampaign_type._id);
          expect($scope.vm.campaign_type._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/campaign_types/client/views/admin/form-campaign_type.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          Campaign_typesAdminController,
          mockCampaign_type;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.campaign_types.edit');
          $templateCache.put('/modules/campaign_types/client/views/admin/form-campaign_type.client.view.html', '');

          // Create mock campaign_type
          mockCampaign_type = new Campaign_typesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Campaign_type about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Campaign_typesAdminController = $controller('Campaign_typesAdminController as vm', {
            $scope: $scope,
            campaign_typeResolve: mockCampaign_type
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:campaign_typeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.campaign_typeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            campaign_typeId: 1
          })).toEqual('/admin/campaign_types/1/edit');
        }));

        it('should attach an campaign_type to the controller scope', function () {
          expect($scope.vm.campaign_type._id).toBe(mockCampaign_type._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/campaign_types/client/views/admin/form-campaign_type.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
