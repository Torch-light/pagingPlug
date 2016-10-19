angular.module('starter.controllers', [])

.controller('DashCtrl', ['$scope',function($scope) {
  $scope.pageModel={
    model:{}, //传给后台的数据模型
    url:'https://XXXX/XXXXX/XXXX', //请求的接口
    allpage:200,//总页码数
    alldata:100,//总数据条数
    pagenum:6,//当前页码显示数量
    ajaxType:'get', //请求的类型 get post 
    headAuth:{
    Authorization:'Bearer dsadaewdgfsdf'
    } //请求头，没有则为null
  };
 

}])

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
