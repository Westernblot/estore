angular.module('starter.controllers', ['ngCordova'])

//发运单
.controller('DashCtrl', function($scope, $ionicModal, $state, $location, locals) {

		//用户登录拦截
		$scope.$on('$ionicView.beforeEnter', function() {

			console.log('beforeEnter..' + locals.get("username", ""));
			var username = locals.get("username", "");
			if (username == '') {
				//$location.path("login");
				$state.go('login');
			}

		});


		//去查询结果页面
		$scope.toDashList = function() {

			$state.go('dash_list',{stock:"仓库1号",no:"鄂B：0000001"});
		};



		//----------------------分割线------------------------

		//动画
		$ionicModal.fromTemplateUrl('templates/login.html', {
			scope: $scope,
			animation: 'slide-in-left' //<---- 改变这里，默认是'slide-in-up' 换成slide-in-left 试试
		}).then(function(modal) {
			$scope.modal = modal;
		});

		$scope.popToast = function() {
			var msg = "您使用的设备是:" + $cordovaDevice.getModel();
			$cordovaToast.show(msg, 'long', 'center').then(function(success) {
				// success
			}, function(error) {
				// error
			});
		};

		//打开一个窗口，带动画效果
		$scope.popWin = function() {
			$scope.modal.show();
		};


	})
	//搬运单
	.controller('ChatsCtrl', function($scope,$state,$timeout, Chats, $cordovaDatePicker, $cordovaSpinnerDialog) {
		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//
		//$scope.$on('$ionicView.enter', function(e) {
		//});
		// $cordovaSpinnerDialog.show("", "正在加载内容，请稍候...", true);

		// $timeout(function() {
		// 	$cordovaSpinnerDialog.hide();
		// }, 2000);

		//去查询结果页面
		$scope.toDashList = function() {

			$state.go('dash_list',{stock:"仓库1号",no:"鄂B：0000001"});
		};



	}).controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
		$scope.chat = Chats.get($stateParams.chatId);
	})
	//登录
	.controller('LoginCtrl', function($scope, $http, $location, locals, $cordovaToast) {

		$scope.doLogin = function() {
			var username = $('#username').val();
			var password = $('#password').val();
			var sendData = "username=" + username + "&password=" + password;

			var url = "http://sso.jingpai.com/LoginHandler.ashx";
			//url += "?" + sendData;

			//var url = 'http://p0132.applinzi.com/index.php/Home/Index/doLogin';

			$http.post(url, {
				username: username,
				password: password
			}).success(function(data) {
				console.log(data);
				console.log(data.UserNumber);
				console.log(data.FullName);

				if (data.Flag == 1) {
					//存储数据
					locals.set("username", data.UserNumber);
					locals.set("fullname", data.FullName);
					$location.path("tab/dash");

				} else {
					$cordovaToast.showShortCenter("用户名或者密码错误!").then(function(success) {
						// success
					}, function(error) {
						// error
					});
				}
			}).error(function() {
				$cordovaToast.showShortCenter("网络错误!").then(function(success) {
					// success
				}, function(error) {
					// error
				});
			});

		};



	})
	//个人中心
	.controller('UserCtrl', function($scope, $ionicModal, $location, $state, locals, $cordovaToast) {

		$scope.username = locals.get("username", "");
		$scope.fullname = locals.get("fullname", "");

		//关于劲酒动画
		$ionicModal.fromTemplateUrl('templates/about.html', {
			scope: $scope,
			animation: 'slide-in-left' //<---- 改变这里，默认是'slide-in-up' 换成slide-in-left 试试
		}).then(function(modal) {
			$scope.aboutModal = modal;
		});


		//打开关于劲酒
		$scope.aboutMe = function() {
			$scope.content = "  劲牌有限公司创建于1953年，历经六十余年的稳步发展，现已成为一家专业化的健康食品企业。产品从单一的白酒发展成为以保健酒、白酒和生物医药为三大核心业务的健康产业结构。拥有面积350亩的保健酒工业园、930亩的原酒生态园和1100亩的健康产业园，年生产保健酒的综合能力达到18万吨。2015年，劲牌销售额突破84.99亿元，上交税金逾23.34亿元人民币，直接用于公益慈善事业的投入达1.8亿余元。 ";
			$scope.aboutModal.show();
		};

		//--------------------------------------------------

		//修改密码动画
		$ionicModal.fromTemplateUrl('templates/updatePwd.html', {
			scope: $scope,
			animation: 'slide-in-left' //<---- 改变这里，默认是'slide-in-up' 换成slide-in-left 试试
		}).then(function(modal) {
			$scope.updatePwdModal = modal;
		});

		//退出
		$scope.logout = function() {
			locals.set("username", "");
			locals.set("fullname", "");
			//$location.path("login");
			$state.go('login');
		};

		//清理缓存
		$scope.toast = function(msg) {
			$cordovaToast.showShortCenter(msg).then(function(success) {
				// success
			}, function(error) {
				// error
			});
		};

	})
	//关于劲酒
	.controller('AboutCtrl', function($scope, $ionicHistory, $location, $window) {
		$scope.back = function() {
			$ionicHistory.goBack();
			//$window.history.back();
			//$location.path("login");
			//alert(1);
		};
	})
	//新闻测试
	.controller('newCtrl', function($scope, $ionicHistory) {

		$scope.back = function() {
			$ionicHistory.goBack();
			//返回上一页
		};
	})
	//发运单查询结果
	.controller('DashListCtrl', function($rootScope,$scope,$stateParams,$ionicHistory, $timeout, $ionicLoading, $ionicScrollDelegate) {


		// // Setup the loader
		// $ionicLoading.show({
		// 	content: 'Loading',
		// 	animation: 'fade-in',
		// 	showBackdrop: true,
		// 	maxWidth: 200,
		// 	showDelay: 0
		// });

		// // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
		// $timeout(function() {
		// 	$ionicLoading.hide();
		// 	//$scope.stooges = [{name: 'Moe'}, {name: 'Larry'}, {name: 'Curly'}];
		// 	$scope.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
		// }, 2000);


		$scope.back = function() {
			//$ionicHistory.goBack();
			$rootScope.$ionicGoBack();
			//返回上一页
		};

        var stock = $stateParams.stock;
        var no = $stateParams.no;
		//alert(stock+"-"+no);


        $scope.items = [];
		$scope.moredata = false;


		$scope.doRefresh = function() {
			//alert(1);
			$scope.$broadcast('scroll.refreshComplete');

		};

		//数据绑定
		var arrayObj = new Array();　 //创建一个数组

		$scope.loadMore = function() {
			$timeout(function() {
				
				var j=arrayObj.length;
				for (var i = 0; i <= 14; i++) {
					arrayObj.push(j + i);
				}
				//alert(arrayObj);
				$scope.items = arrayObj;
				//$scope.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicScrollDelegate.$getByHandle('mainScroll').resize();
				if ($scope.items.length > 20) {
					$scope.moredata = true;
				}

			}, 1500);

		};


	})
	//实时库存
	.controller('AccountCtrl', function($scope,$state) {

        //去查询结果页面
		$scope.toDashList = function() {

			$state.go('dash_list',{stock:"仓库1号",no:"鄂B：0000001"});
		};

		$scope.settings = {
			enableFriends: true
		};
	});