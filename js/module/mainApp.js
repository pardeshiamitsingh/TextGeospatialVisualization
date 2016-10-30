var vApp = angular.module('mainApp', [])
	.controller('TabCtrl', ['$scope', function ($scope) {
		// Start Rendering Tabs.
		$scope.tabs = [{
					title: 'Most Popular Words',
					url: 'wordcloud.tpl.html'
				}, {
					title: 'Popular Terms Graph',
					url: 'graph.tpl.html'
				}, {
					title: 'Relationships',
					url: 'relationships.tpl.html'
				}
			];

		$scope.currentTab = 'wordcloud.tpl.html';

		$scope.onClickTab = function (tab) {
			$scope.currentTab = tab.url;
		}
		
		$scope.isActiveTab = function(tabUrl) {
			return tabUrl == $scope.currentTab;
		}
		// End Rendering Tabs.

	    $scope.showRelationships = function () {
	        //Creating Force Layout to display relationships.
	    	showRelationships($scope.term);
	    }
	}]);