var app = angular.module('currencyApp', []);

app.controller('CurrencyController', function($scope, $http) {
    $scope.amount = 1;
    $scope.fromCurrency = 'USD';
    $scope.toCurrency = 'INR';
    $scope.exchangeRates = {};

    // Fetch exchange rates from an API (replace 'YOUR_API_KEY' with a real key)
    $http.get(`https://open.er-api.com/v6/latest/USD?apikey=${apikey}`)
        .then(function(response) {
            $scope.exchangeRates = response.data.rates;
        });

    // Convert currency
    $scope.convertCurrency = function() {
        if ($scope.exchangeRates[$scope.fromCurrency] && $scope.exchangeRates[$scope.toCurrency]) {
            var fromRate = $scope.exchangeRates[$scope.fromCurrency];
            var toRate = $scope.exchangeRates[$scope.toCurrency];
            $scope.convertedAmount = ($scope.amount / fromRate) * toRate;
        }
    };

    // Swap currencies
    $scope.swapCurrencies = function() {
        var temp = $scope.fromCurrency;
        $scope.fromCurrency = $scope.toCurrency;
        $scope.toCurrency = temp;
        $scope.convertCurrency();
    };
});
