// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ionic-native-transitions'])

.run(function($ionicPlatform, $rootScope, $cordovaKeyboard, $ionicHistory, $location, $state, $http, $cordovaDevice, $cordovaToast, $ionicActionSheet, $timeout, $cordovaAppVersion, $ionicPopup, $ionicLoading, $cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    //插件调用测试
    //cordova.plugins.CoolPlugin.showToast("你好啊",4);  

    //手动隐藏  splash 页面
    if (navigator && navigator.splashscreen) {
      navigator.splashscreen.hide();
    }

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //------------------定义全局变量，服务器获取数据---------------------------------
    //var serverVersion = "2.3";
    //var serverUrl = "http://p0132.applinzi.com/Public/res/jp.apk";
    //var serverDescription = "1.xxxxxxxxxxx<br>2.ccccccccccc3.ddddddddddd";

    // $http.get("http://p0132.applinzi.com/index.php/Home/Index/getServerData").success(function(data) {
    //   var serverVersion = data.version;
    //   var serverUrl = data.serverUrl;
    //   var serverDescription = data.description;

    //   //检测更新
    //   //checkUpdate(serverAppVersion, serverUrl, serverDescription);
    //   cordova.plugins.AutoUpdatePlugin.update(null, null, serverVersion, serverUrl, serverDescription);
    // }).error(function(data, header, config, status) {
    //   //处理响应失败
    //   $cordovaToast.showLongCenter("网络异常").then(function(success) {
    //     // success
    //   }, function(error) {
    //     // error
    //   });
    // });
    //------------------定义全局变量---------------------------------

    //document.addEventListener("menubutton", onHardwareMenuKeyDown, false);

  });

  //双击退出
  $ionicPlatform.registerBackButtonAction(function(e) {

    //判断处于哪个页面时双击退出
    if ($location.path() == '/tab/dash' || $location.path() == '/tab/chats' || $location.path() == '/tab/account' || $location.path() == '/tab/user' || $location.path() == '/login') {
      if ($rootScope.backButtonPressedOnceToExit) {
        ionic.Platform.exitApp();
      } else {
        $rootScope.backButtonPressedOnceToExit = true;
        $cordovaToast.showShortCenter('再按一次退出系统');
        setTimeout(function() {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
    } else if ($ionicHistory.backView()) {
      if ($cordovaKeyboard.isVisible()) {
        $cordovaKeyboard.close();
      } else {
        //$ionicHistory.goBack();
        $rootScope.$ionicGoBack();
      }

    } else {
      $rootScope.backButtonPressedOnceToExit = true;
      $cordovaToast.showShortCenter('再按一次退出系统');
      setTimeout(function() {
        $rootScope.backButtonPressedOnceToExit = false;
      }, 2000);
    }
    e.preventDefault();
    return false;
  }, 101);


})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  //配置ionic-native-transitions
  $ionicNativeTransitionsProvider.setDefaultOptions({
    duration: 300, // in milliseconds (ms), default 400,
    slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
    iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
    androiddelay: -1, // same as above but for Android, default -1
    winphonedelay: -1, // same as above but for Windows Phone, default -1,
    fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
    fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
    backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
  });

  //配置默认的页面切换效果
  $ionicNativeTransitionsProvider.setDefaultTransition({
    type: 'slide',
    direction: 'left'
  });



  $ionicNativeTransitionsProvider.setDefaultBackTransition({
    type: 'slide',
    direction: 'right'
  });

  //解决angular.js $http.post异常的问题
  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  // Override $http service's default transformRequest 
  $httpProvider.defaults.transformRequest = [function(data) {
    /**     * The workhorse; converts an object to x-www-form-urlencoded serialization.     * @param {Object} obj     * @return {String}     */
    var param = function(obj) {
      var query = '';
      var name, value, fullSubName, subName, subValue, innerObj, i;
      for (name in obj) {
        value = obj[name];
        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
      return query.length ? query.substr(0, query.length - 1) : query;
    };
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];


  //解决样式显示的问题
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');


  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    nativeTransitions: null,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      nativeTransitions: null,
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      nativeTransitions: null,
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
      url: '/account',
      nativeTransitions: null,
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('tab.user', {
      url: '/user',
      nativeTransitions: null,
      views: {
        'tab-user': {
          templateUrl: 'templates/tab-user.html',
          controller: 'UserCtrl'
        }
      }
    })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('about', {
      url: '/about',
      templateUrl: 'templates/about.html',
      controller: 'AboutCtrl'
    })
    .state('dash_list', {
      cache: false,
      url: '/dash_list/:stock/:no',
      templateUrl: 'templates/dash-list.html',
      controller: 'DashListCtrl'
    })
    .state('news', {
      url: '/news',
      templateUrl: 'templates/news.html',
      controller: 'newCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});