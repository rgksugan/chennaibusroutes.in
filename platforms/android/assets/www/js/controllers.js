angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  $ionicModal.fromTemplateUrl('templates/results.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

})

.controller('TripCtrl', function($scope) {
  $scope.findRoutes = function (from, to) {
    $scope.modal.show();
  };
});
