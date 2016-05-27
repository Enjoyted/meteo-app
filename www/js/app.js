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

app.controller('appController',['$scope', 'parser', 'files', '$filter', '$cordovaFileTransfer', function($scope, parser, files, $filter, $cordovaFileTransfer) {
  $scope.page = "listing";
  $scope.fileSelected = {};
  $scope.files = files.getFiles();

  $scope.changePage = function(page) {
    $scope.page = page;
  };

  $scope.selectFile = function(file) {
    $scope.fileSelected = file;
    $scope.data = JSON.parse(parser.csvToJson(parser.cleanString($scope.fileSelected.data)));
    console.log('a', $scope.data);
    console.log('b', $scope.getDataGraph1('AIR_TEMPERATURE'));
    $scope.changePage('graph');
    $scope.getGraph1(1, $scope.getDataGraph1('AIR_TEMPERATURE'), 'Daily Average AIR_TEMPERATURE', 'Temperature (°C)', '°C');
    $scope.getGraph1(2, $scope.getDataGraph1('REL_HUMIDITY'), 'Daily Average Humidity', 'Humidity %', '%');
    $scope.getGraph1(3, $scope.getDataGraph1('AIR_PRESSURE'), 'Daily Average Pressure', 'Pressure (hPa)', 'hPa');
    $scope.getGraph1(4, $scope.getDataGraph1('LOCAL_WS_2MIN_MNM', 'LOCAL_WD_2MIN_MNM'), 'Daily Average LOCAL_WS_2MIN_MNM', 'Temperature (°C)', '°C');
    $scope.getGraph2();
    $scope.getGraph3();
  };

  $scope.getDataGraph1 = function(key1, key2) {
    var data = [];
    for (var i = 0; i <= 23; i++) {
      data.push($filter('filter')($scope.data, {CREATEDATE: ' ' + (i < 10 ? ('0' + i) : i) + ':'}));
    }

    var dataMax = [];
    var dataMin = [];
    var dataAvg = [];

    var dataMaxAvg = [];
    var dataMinAvg = [];
    var dataAvgAvg = [];

    for (var i in data) {

      var max = undefined;
      var min = undefined;
      var avg = 0;

      for (var c in data[i]) {
        var value = parseFloat(data[i][c][key1]);
        max = (max == undefined ? value : (max < value ? value : max));
        min = (min == undefined ? value : (min > value ? value : min));
        avg += value;
      }
      avg = (avg / data.length);
      dataMax.push(max);
      dataMin.push(min);
      dataAvg.push(avg);
    }

    var series = [{
      name: 'Max',
      data: dataMax
    }, {
      name: 'Min',
      data: dataMin
    }, {
      name: 'Avg',
      data: dataAvg
    }];

    return series;
  };

  $scope.getGraph1 = function(id, series, title, ytitle, suffix) {

    var chart = new Highcharts.Chart({    
      chart: {
        renderTo: 'graph1-' + id
      },
      title: {
        text: title,
        x: -20 //center
      },
      xAxis: {
        categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
      },
      yAxis: {
        title: {
          text: ytitle
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        valueSuffix: suffix
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      series: series
    });
  };
  
  $scope.getGraph2 = function() {

    var chart = new Highcharts.Chart({
      chart: {
        renderTo: 'graph2',
        zoomType: 'x'
      },
      title: {
        text: 'USD to EUR exchange rate over time'
      },
      subtitle: {
        text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Exchange rate'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },

      series: [{
        type: 'area',
        name: 'USD to EUR',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
      }]
    });
  };
  
  $scope.getGraph3 = function() {
    var chart = new Highcharts.Chart({
      chart: {
        polar: true,
        type: 'column',
        renderTo: 'graph3',
      },

      title: {
        text: 'Wind rose for South Shore Met Station, Oregon'
      },

      subtitle: {
        text: 'Source: or.water.usgs.gov'
      },

      pane: {
        size: '85%'
      },

      legend: {
        align: 'right',
        verticalAlign: 'top',
        y: 100,
        layout: 'vertical'
      },

      xAxis: {
        tickmarkPlacement: 'on'
      },

      yAxis: {
        min: 0,
        endOnTick: false,
        showLastLabel: true,
        title: {
          text: 'Frequency (%)'
        },
        labels: {
          formatter: function () {
            return this.value + '%';
          }
        },
        reversedStacks: false
      },

      tooltip: {
        valueSuffix: '%'
      },

      plotOptions: {
        series: {
          stacking: 'normal',
          shadow: false,
          groupPadding: 0,
          pointPlacement: 'on'
        }
      }
    });
  };

  $scope.testFileUpload = function () {
    console.log('hey upload');
    var url = "";

    //File for Upload
    var targetPath = cordova.file.externalRootDirectory;

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
  };
}]);
