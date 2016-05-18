// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('meteo', ['ionic', 'ngCordova']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.controller('FileTransferController', function($scope, $cordovaFileTransfer) {
  $scope.testFileDownload = function () {
    console.log('hey download');
    // File for download
    var url = "https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg";
     
    // File name only
    var filename = url.split("/").pop();
     
    // Save location
    var targetPath = cordova.file.externalRootDirectory + filename;
    console.log(targetPath);
     
    $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
        console.log('Success');
    }, function (error) {
        console.log('Error');
    }, function (progress) {
        // PROGRESS HANDLING GOES HERE
    });
  }
  $scope.testFileUpload = function () {
    console.log('hey upload');
    var url = "http://example.gajotres.net/upload/upload.php";

    //File for Upload
    var targetPath = cordova.file.externalRootDirectory + "maxresdefault.png";

    // File name only
    var filename = targetPath.split("/").pop();

    var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "image/jpg",
        params : {'directory':'upload', 'fileName':filename}
    };
         
    $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
        console.log("SUCCESS: " + JSON.stringify(result.response));
    }, function (err) {
        console.log("ERROR: " + JSON.stringify(err));
    }, function (progress) {
        // PROGRESS HANDLING GOES HERE
    });
  }
});
