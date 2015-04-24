'use strict';

angular.module('ng2edu', ['ui.unique', 'ngResource', 'ui.router']);

angular.module('ng2edu')
	.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('main', {
            url: "/main",
            templateUrl: "app/main/main.html"
        })
        .state('linklist', {
            url: "/linklist",
            templateUrl: "app/components/linklist/linklist.html"
        });

        $urlRouterProvider.otherwise("/main");

	});