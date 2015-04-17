'use strict';

angular.module('ng2ed')
.controller('MainCtrl', function ($scope, $http, $filter, Embed) {

	var getLinksFromMarkdown = function getLinksFromMarkdown(rawDoc) {
		var sections = [];
		var rawSections = rawDoc.split(/###/g);
		for (var i = rawSections.length - 1; i >= 0; i--) {
			if (rawSections[i][0] !== " ") {
				rawSections.splice(i,1);
			} else {
				rawSections[i] = rawSections[i].substring(1);
			}
			var sectionContents = rawSections[i].split(/\r\n|\r|\n/g);
			var sectionTitle = sectionContents[0];
			sectionContents.splice(0,1);
			var links = [];
			for (var ii = sectionContents.length - 1; ii >= 0; ii--) {
				var re = /\(\http([^)]+)\)/g;
				sectionContents[ii] = sectionContents[ii].match(re);
				if (sectionContents[ii]) {
					sectionContents[ii] = {originalUrl: sectionContents[ii][0].substring(1, sectionContents[ii][0].length - 1)};
					links.push(sectionContents[ii]);
				};
			};
			
			var section = {
				title: sectionTitle,
				links: links
			};
			sections.push(section);
		};
		sections.reverse();
		return sections;
	};

	var getEmbeds = function getEmbeds(linksArr) {
		for (var i = linksArr.length - 1; i >= 0; i--) {
			linksArr[i] = Embed.get(linksArr[i].originalUrl);
		};
		return linksArr;
	};

	$http.get('angular2-education/README.md').then(
		function(resp) {
			$scope.sections = $filter('unique')(getLinksFromMarkdown(resp.data));
		},
		function(err) {
			console.log(err);
		}).then(function() {
			for (var i = $scope.sections.length - 1; i >= 0; i--) {
				$scope.sections[i].links = getEmbeds($scope.sections[i].links);
			};
			console.log($scope.sections);
		});
});

angular.module('ng2ed')
.service('Embed', ['$resource', function($resource){
	var Link = $resource('http://api.embed.ly/1/oembed?url=:url');
	this.get = function(_url) {
		var link = Link.get({url:_url});
		return link;
	};
}])