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
          mainstate = $state.get('campaign_types');
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
          liststate = $state.get('campaign_types.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/campaign_types/client/views/list-campaign_types.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          Campaign_typesController,
          mockCampaign_type;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('campaign_types.view');
          $templateCache.put('/modules/campaign_types/client/views/view-campaign_type.client.view.html', '');

          // create mock campaign_type
          mockCampaign_type = new Campaign_typesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Campaign_type about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Campaign_typesController = $controller('Campaign_typesController as vm', {
            $scope: $scope,
            campaign_typeResolve: mockCampaign_type
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:campaign_typeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.campaign_typeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            campaign_typeId: 1
          })).toEqual('/campaign_types/1');
        }));

        it('should attach an campaign_type to the controller scope', function () {
          expect($scope.vm.campaign_type._id).toBe(mockCampaign_type._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/campaign_types/client/views/view-campaign_type.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/campaign_types/client/views/list-campaign_types.client.view.html', '');

          $state.go('campaign_types.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('campaign_types/');
          $rootScope.$digest();

          expect($location.path()).toBe('/campaign_types');
          expect($state.current.templateUrl).toBe('/modules/campaign_types/client/views/list-campaign_types.client.view.html');
        }));
      });
    });
  });
}());
