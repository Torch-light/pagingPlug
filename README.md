	<h1>
	带请求的分页插件:
	</h1>
	<p>使用方式：
	引入pagingPlug.js。
	在你的angular.module('youapp',['pagingPlug'])。
	在你需要使用该组件的html页面上面设置
	 <pagging model="pageModel" ng-if="isPageTrue"></pagging>
	</p>
	<p>
	在你的控制器里写上
	 $scope.pageModel = {
                model: {
                    pageIndex: 1,
                    type: 'payer',
                    pageSize: 6,
                    cardtype: -1,
                },//传给后台的数据模型,第一个必须是页码。
                url: 'http://xxxxxxx/MemberCard/GetMemberCardRecord',//请求的接口
                allpage: 100,//总页码数，
                alldata: 100,//总数据条数
                pagenum: 6,//当前页码显示数量
                ajaxType: 'get', //请求的类型 get post 
                headAuth: {
                    Authorization: 'Bearer '
                }  后台有特殊验证的可以加在这里面,没有则为null

        };
        第一次调用后台数据时
	 service.GetSummary(obj).then(function (data) {
			$scope.pageModel.allpage=data.jsondata.total;  
			$scope.pageModel.alldata=data.jsondata.totalCount;
			//取到总的页码数,和数据条数，这样分页算出来的才是正确的，不然会是默认值
			$scope.isPageTrue=true;
			//设置isPageTrue为true,这个时候才会去加载分页.这个值可以自己配置
      }，
      在你动态改变传给后台的数据模型的时候，记得把
      $scope.pageModel.model里面的值更新,
      在控制器js里面写上
        $scope.pageCall = function (obj) {
                vm.cashiers.Summary = obj.jsondata.list;
                //obj就是你从后台取到的值。
         }
         
	</p>