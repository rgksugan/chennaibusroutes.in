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
  $scope.trip = {
    from: '',
    to: ''
  };
  $scope.findRoutes = function () {
    var data;
    var at = [];
    var bnm;
    var fromStage = $("#from").val();
    var toStage = $("#to").val();
    $.get(' http://busroutes.in/chennai/api/autocomplete/stages ', function(json) {
      data = json;
      var fromId = data[fromStage];
      var toId = data[toStage];
      if (fromId == null) {
        alert("Invalid Stage Name: \"" + $("#from").val() + "\"\nChoose any one of the suggested stage names.");
        return;
      }
      if (toStage == '') {
        top.location = "http://busroutes.in/chennai/stage/" + fromId + "/";
      } else if (toId == null) {
        alert("Invalid Stage Name: \"" + $("#to").val() + "\"\nChoose any one of the suggested stage names.");
        return;
      } else {
        var url = 'http://busroutes.in/chennai/path/' + fromId + '/' + toId + '/';
        console.log('html', fromId, toId);
        $.get(url, function(html) {
          console.log('html', html);
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
            $("#formlist").append("<h3>" + from + " to " + to + "</h3><p>" + bus.substring(1)+ "</p>");
          }
        });
      }
    });
    $scope.modal.show();
  };
})

.directive('autoComplete', function() {
  return {
    link: function (scope, element) {
      $.get('js/stages.json', function (stages) {
        element.autocomplete({
          source: stages
        });
      });
    }
  };
});
