module = angular.module('app', ['ngRoute', 'ngAnimate'])

    .controller('appCtrl', function ($scope, $rootScope, $route, $window, $location) {
        $scope.menuActive = false;
        $scope.showHeader = false;
        $rootScope.mobile = $window.outerWidth < 768;

        $scope.menuSwitch = function () {
            $scope.menuActive = !$scope.menuActive;
            $scope.showHeader = $scope.menuActive;
        };

        $rootScope.changeLocation = function (location) {
            $scope.menuActive = false;
            $location.path('/' + location);
        };

        $rootScope.goToExternalSite = function (url) {
            $window.location.href = url;
        }
    })

    // Shrinking header from https://codepen.io/mattc0m/pen/RPMZKG
    .directive("scroll", function ($window) {
        return function (scope, element, attrs) {
            angular.element($window).bind("scroll", function () {

                scope.showHeader = (this.pageYOffset >= 50) || scope.menuActive;
                scope.$apply();
            });
        };
    })

    .directive("parallax", function ($window) {
        function link(scope, element, attrs) {
            let offset;

            angular.element($window).bind("scroll", function () {
                offset = -.6 * this.pageYOffset / 2;
                console.log(offset);
                applyOffset();
            });

            function applyOffset() {
                element.css('top', offset + "px");
            }
        }

        return {
            link: link
        }
    })

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/music', {
                controller: 'musicCtrl',
                templateUrl: 'views/music.html'
            })
            .when('/code', {
                controller: 'codeCtrl',
                templateUrl: 'views/code.html'
            })
            .when('/home', {
                templateUrl: 'views/main.html'
            })
            .otherwise({
                templateUrl: 'views/main.html'
            });
    });

module.controller('codeCtrl', function ($scope, $http) {
    // To animate addition of projects
    $scope.projects = [];

    $http.get("content/projects.json")
        .then(function(data) {
            $scope.projects = data.data;
        }, function(error) {
            console.log("Couldn't get project data.");
        })
});

module.controller('musicCtrl', function ($scope, $http) {
    // To animate addition of albums
    $scope.music = [];

    $http.get("content/music.json")
        .then(function(data) {
            $scope.music = data.data;
        }, function(error) {
            console.log("Couldn't get project data.");
        })
});
