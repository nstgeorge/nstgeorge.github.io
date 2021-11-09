angular.module('app', ['ui.bootstrap'])

.controller('appCtrl', function($scope) {
  var descIndex = 0;
  var descriptions = [
    'organization.',
    'simplicity.',
    'efficiency.',
    'creativity.'
  ];
  $scope.selectedDescription = descriptions[descIndex];
  setInterval(function() {
    descIndex++;
    $scope.selectedDescription = descriptions[descIndex % descriptions.length];
    $scope.$apply();
  }, 4000);
})
