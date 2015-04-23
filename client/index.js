'use strict';

angular.module('day-trader', ['firebase'])
.run(['$rootScope', '$window', function($rootScope,$window){
  $rootScope.fbRoot = new $window.Firebase('https://day-trader.firebaseio.com/');
}])
.controller('master',['$scope','$firebaseObject','$firebaseArray','$http',function($scope,$firebaseObject,$firebaseArray,$http){

  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);
  $scope.user = afUser;

  var fbPortfolios = $scope.fbRoot.child('technology');
  var afPortfolios = $firebaseArray(fbPortfolios);
  $scope.technology = afPortfolios;

  var fbPortfolios2 = $scope.fbRoot.child('medical');
  var afPortfolios2 = $firebaseArray(fbPortfolios2);
  $scope.medical = afPortfolios2;

  var fbPortfolios3 = $scope.fbRoot.child('realestate');
  var afPortfolios3 = $firebaseArray(fbPortfolios3);
  $scope.realestate = afPortfolios3;

  $scope.saveUser = function(){
    $scope.user.$save();
  };

  $scope.portTotal = function(portfolio){
    var total = 0;
    $scope[portfolio].forEach(function(current){
      total += (current.price * current.shares);
    });
    return total;
  };

  $scope.sellStock = function(stock,port){
    $scope.user.balance += (stock.price * stock.shares);
    $scope[port].$remove(stock);
    $scope.saveUser();
  };

  $scope.buyStock = function(){
    $http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+$scope.stock.symbol+'&callback=JSON_CALLBACK').then(function(response){
      var stock = {};
      stock.shares = $scope.stock.shares;
      stock.symbol = $scope.stock.symbol;
      stock.price = (response.data.LastPrice);

      if ($scope.user.balance - (stock.shares * stock.price) >= 0 && ($scope.stock.portfolio)){
        $scope[$scope.stock.portfolio].$add(stock);
        $scope.newBalance(stock.price, stock.shares);
      } else {
        alert('Check your input and try again..');
      }
      $scope.newBalance(0,0);
    });
  };

  $scope.newBalance = function(price, shares){
    $scope.user.balance = ($scope.user.balance - (price * shares));
    $scope.saveUser();
  };
}]);
