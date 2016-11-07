  "use strict"
        var pagging = angular.module('pagingPlug', []);
        pagging.directive('paging', ['$http', '$q','$rootScope', function ($http, $q,$rootScope) {
            // Runs during compile
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    model: "="
                },
                template: '<div class="pagging-div-warp">' +
                  '<ul class="ul-warp" ng-if="alldata>0">' +
                  '<button  class="btn" ng-click="page.onePage()" ng-disabled="indexPage==1">首页</button>' +
                  '<button  class="btn" ng-click="page.upPage()" ng-disabled="indexPage==1">上一页</button>' +
                  '<li class="num" ng-class={true:"active",false:"notactive"}[pagging==indexPage]  ng-repeat="pagging in paggingArr track by $index" ng-click="page.index(pagging)">{{pagging}}</li>' +
                  '<button  class="btn" ng-click="page.downPage()" ng-disabled="indexPage==allpage">下一页</button>' +
                  '<button  class="btn" ng-click="page.lastPage()" ng-disabled="indexPage==allpage">尾页</button>' +
                  '<span>跳页至<input ng-model="goIndex.index" ng-change="changeInputValue()"></span>' +
                  '<button ng-click="page.sure()" class="btn" ng-if="goIndex.index">确定</button>' +
                  '<span>共{{allpage}}页/{{alldata}}条数据</span>' +
                  '</ul>' +
                  '</div>',
                link: function ($scope, element, attrs) {
                    $scope.indexPage = 1;
                    $scope.goIndex = {
                        index: ''
                    };
                    var allpage,
                        url,
                        alldata,
                        pagenum,
                        ajaxType,
                        headAuth = null,
                        model = {},
                        flag = true;
                    var allModel = [], i = 1;
                    if ($scope.model) {
                        for (var _model in $scope.model) {
                            allModel[i] = $scope.model[_model]
                            i++;
                        }
                    }
                    $scope.allpage = allModel[3];
                    $scope.alldata = allModel[4];
                    model = allModel[1];
                    url = allModel[2];
                    allpage = allModel[3];
                    alldata = allModel[4];
                    pagenum = allModel[5] || 6;
                    ajaxType = allModel[6] || 'get';
                    headAuth = allModel[7] || null;
                    var pageMid = Math.floor(pagenum / 2);
                    var flipnum;
                    $scope.apiCall = {
                        mosaic: function (param) {
                            var u = "?";
                            for (var x in param) {
                                u = u + x + '=' + param[x] + '&';
                            }
                            u = u.substr(0, u.length - 1);
                            return u;
                        },
                        getRequest: function () {
                            flag = true;
                            for (var _model in model) {
                                if (flag) {
                                    model[_model] = $scope.indexPage;
                                    flag = false;
                                }
                            }
                            var result = [];
                            result.$promise = null;
                            ajaxType = ajaxType.toLowerCase();
                            switch (ajaxType) {
                                case "get":
                                    result.$promise = $http.get(url + $scope.apiCall.mosaic(model));
                                    break;
                            }
                            return result.$promise;
                        },
                        addToken: function () {
                            if (allModel.length > 0) {
                                if (headAuth) {
                                    $http.defaults.headers.common = headAuth;
                                };
                                $scope.apiCall.getRequest().success(function (data) {
                                    try {
                                        $scope.model.success.call($scope.model,data);
                                       
                                    } catch (err) {
                                        console.log(err + '请定义success函数');
                                    }
                                   
                                })
                            }

                        }
                    };
                    $scope.page = {
                        init: function () {
                            $scope.paggingArr = [];
                            if (allpage < pagenum) {
                                pagenum = allpage;
                            };
                            for (var i = 1; i <= pagenum; i++) {
                                $scope.paggingArr[i - 1] = i;
                            };
                        },
                        createPage: function () {
                            if (allpage > pagenum) {
                                var temp = $scope.paggingArr[0] + flipnum;
                                if (temp < 1) {
                                    $scope.page.init();
                                } else {
                                    for (var i = 1; i <= pagenum; i++) {
                                        $scope.paggingArr[i - 1] = $scope.paggingArr[i - 1] + flipnum;
                                    }
                                }
                            }
                        },
                        index: function (n) {
                            flipnum = n - $scope.paggingArr[pageMid];
                            if (n + flipnum > allpage) {
                                flipnum = allpage - n;
                            };
                            $scope.indexPage = n;
                            if (flipnum > 0 && $scope.paggingArr[pagenum - 1] < allpage) {
                                $scope.page.createPage();
                            } else if (flipnum < 0 && $scope.paggingArr[0] > 1) {
                                $scope.page.createPage();
                            }

                            $scope.apiCall.addToken();

                        },
                        onePage: function () {
                            if ($scope.indexPage > 1) {
                                $scope.indexPage = 1;
                                $scope.apiCall.addToken();
                                $scope.page.init();
                            }

                        },
                        upPage: function () {
                            $scope.indexPage -= 1;
                            if ($scope.indexPage < 1) {
                                $scope.indexPage = 1;
                            }
                            $scope.page.index($scope.indexPage);

                        },
                        downPage: function () {
                            $scope.indexPage += 1;
                            if ($scope.indexPage > allpage) {
                                $scope.indexPage = allpage;
                            }
                            $scope.page.index($scope.indexPage);
                        },
                        lastPage: function () {
                            if ($scope.indexPage < allpage) {
                                $scope.indexPage = allpage;
                                $scope.apiCall.addToken();
                                for (var i = 1; i <= pagenum; i++) {
                                    $scope.paggingArr[i - 1] = allpage - pagenum + i;
                                };
                            }
                        },
                        sure: function () {
                            $scope.goIndex.index = $scope.goIndex.index - 0;
                            $scope.indexPage = $scope.goIndex.index;
                            if ($scope.indexPage + pageMid <= allpage) {
                                for (var i = 1; i <= pagenum; i++) {
                                    $scope.paggingArr[i - 1] = $scope.indexPage + i - pageMid;
                                    if ($scope.paggingArr[i - 1] <= 0) {
                                        $scope.page.init();
                                        break;
                                    }
                                }
                            } else if ($scope.indexPage + pageMid > allpage) {
                                for (var i = 1; i <= pagenum; i++) {
                                    $scope.paggingArr[i - 1] = allpage - pagenum + i;
                                };
                            }
                            $scope.apiCall.addToken();
                            $scope.goIndex.index = '';
                        }
                    };
                    $scope.changeInputValue = function () {
                            if ($scope.goIndex.index > allpage) {
                                $scope.goIndex.index = allpage;
                            }
                            if ($scope.goIndex.index < 1) {
                                $scope.goIndex.index = 1;
                            }
                            if ($scope.goIndex.index.match(/\W|[a-z|A-Z]/)) {
                                $scope.goIndex.index = $scope.goIndex.index.replace(/\W|[a-z|A-Z]/g, '');
                            }
                            if ($scope.goIndex.index.match(/\d/)) {
                                $scope.goIndex.index = parseInt($scope.goIndex.index);
                            }
                    }

                    $scope.page.init();
                }

            };
        }]);