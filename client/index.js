'use strict';

angular.module('day-trader', ['firebase'])
.run(['$rootScope', '$window', function($rootScope,$window){
  $rootScope.fbRoot = new $window.Firebase('https://day-trader.firebaseio.com/');
}])
.controller('master',['$scope','$firebaseObject','$firebaseArray','$http',function($scope,$firebaseObject,$firebaseArray,$http){

  $scope.getQuote = function(){
    debugger;
    console.log($http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+($scope.stock.symbol)+'&callback=JSON_CALLBACK'));
      //.then(function(response){
      //return response
  };


  var fbPortfolios = $scope.fbRoot.child('portfolios');
  var afPortfolios = $firebaseObject(fbPortfolios);
  $scope.portfolios = afPortfolios;

  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);
  $scope.user = afUser;

  $scope.saveUser = function(){
    $scope.user.$save();
  };

  $scope.buyStock = function(){
    $scope.getQuote();
    // var stock = {
    //   name: 'technology',
    //   sym: $scope.stock.symbol,
    //   shares: $scope.stock.shares
    // };
    $scope.portfolios.$ad();
  };
}]);
