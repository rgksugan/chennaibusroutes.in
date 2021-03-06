angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('SearchCtrl', function($scope, $http, $rootScope, $location) {

  $scope.pageSize = 15;
  $scope.currentPage = 1;
  $scope.searchText = null;

  $http.get('js/stages.json').success(function (stages) {
    $scope.stages = stages.sort();
    $scope.searchResults = _.first($scope.stages, $scope.pageSize);
  });

  $scope.searchStages = function (searchText) {
    $scope.searchResults = [];
    searchText = searchText.trim().toLowerCase();
    $scope.searchText = searchText;
    $scope.stages.forEach(function (stage) {
      if (stage.toLowerCase().indexOf(searchText) >= 0) {
        $scope.searchResults.push(stage);
      }
    });
  };

  $scope.setSearchResult = function (stage) {
    $rootScope.searchResult = stage;
    $location.path('/app/trip');
  };

  $scope.loadMore = function () {
    if (!$scope.searchText) {
      $scope.searchResults = _.first($scope.stages, $scope.pageSize * $scope.currentPage);
      $scope.currentPage++;
    } else {
      $scope.currentPage = 1;
    }
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };
})

.controller('TripCtrl', function($scope, $location, $rootScope, $http, $ionicModal) {
  $scope.goToSearch = function (search) {
    $location.path('/app/search');
    $rootScope.searchField = search;
  };

  $rootScope.trip = $rootScope.trip || {};

  if ($rootScope.searchField && $rootScope.searchResult) {
    $scope.trip[$rootScope.searchField] = $rootScope.searchResult;
  }

  $scope.findRoutes = function () {
    $scope.buses = [];
    var data;
    var at = [];
    var bnm;
    var fromStage = $rootScope.trip.from;
    var toStage = $rootScope.trip.to;
    $http.get('js/stages_index.json').success(function (json) {
      data = json;
      var fromId = data[fromStage];
      var toId = data[toStage];
      if (fromId == null) {
        alert("Invalid Stage Name: \"" + fromStage + "\"\nChoose any one of the suggested stage names.");
        return;
      }
      if (toStage == '') {
        top.location = "http://busroutes.in/chennai/stage/" + fromId + "/";
      } else if (toId == null) {
        alert("Invalid Stage Name: \"" + toStage + "\"\nChoose any one of the suggested stage names.");
        return;
      } else {
        var url = 'http://busroutes.in/chennai/path/' + fromId + '/' + toId + '/';
        $http.get(url).success(function(html) {
          var data = html.substring(html.indexOf("<div class=\"leftCol\">"), html.indexOf("<div id=\"map\">"));
          while (data.indexOf("From") > 0) {
            var from = data.substring(data.indexOf("From") + 5, data.indexOf("<br />"));
            from = from.substring(from.indexOf(">") + 1, from.indexOf("</a>"));
            var to = data.substring(data.indexOf("To") + 3, data.indexOf("</a>", data.indexOf("To")));
            to = to.substring(to.indexOf(">") + 1);
            var take = data.substring(data.indexOf("Take"), data.indexOf("<hr />"));
            from.trim();
            to.trim();
            var bus = "";
            while (take.indexOf("<a href=") > 0) {
              bus += ", " + take.substring(take.indexOf("/\">") + 3, take.indexOf("</a>", take.indexOf("/\">") + 3)).trim();
              take = (take.substring(take.indexOf("/\">") + 3));
            }
            var i = data.indexOf("<h3>", data.indexOf(to));
            if (i > 0) {
              data = data.substring(i);
            } else {
              data = "";
            }
            $scope.buses.push({
              from: from,
              to: to,
              bus: bus.substring(1)
            });
          }
        });
      }
    });

    $ionicModal.fromTemplateUrl('templates/results.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });

    $scope.closeResults = function() {
      $scope.modal.hide();
    };
  };
});
