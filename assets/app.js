var app = angular.module('currencyApp', []);

app.controller('CurrencyController', function ($scope, $http) {
    $scope.amount = 1;
    $scope.fromCurrency = 'USD';
    $scope.toCurrency = 'INR';
    $scope.exchangeRates = {};
    $scope.convertedAmount = 0;
    $scope.loading = true;

    const apiKey = '5fa8d2dfd87bd4e4e736655f'; // Replace with your actual API key

    // Fetch exchange rates
    function fetchExchangeRates() {
        $http.get(`https://open.er-api.com/v6/latest/USD?apikey=${apiKey}`)
            .then(function (response) {
                if (response.data && response.data.rates) {
                    $scope.exchangeRates = response.data.rates;
                    console.log("Exchange Rates Loaded:", $scope.exchangeRates);
                    $scope.convertCurrency(); // Ensure initial conversion
                } else {
                    console.error('Invalid API response:', response);
                }
            })
            .catch(function (error) {
                console.error('Error fetching exchange rates:', error);
            })
            .finally(function () {
                $scope.loading = false;
                $scope.$applyAsync();
            });
    }

    // Call function to fetch rates
    fetchExchangeRates();

    // Convert currency function
    $scope.convertCurrency = function () {
        console.log(`Converting ${$scope.amount} ${$scope.fromCurrency} to ${$scope.toCurrency}`);
    
        if (!$scope.exchangeRates || Object.keys($scope.exchangeRates).length === 0) {
            console.error("Exchange rates not available yet!");
            return;
        }
    
        if (typeof $scope.fromCurrency !== "string" || typeof $scope.toCurrency !== "string") {
            console.error(`Invalid currency selection: ${$scope.fromCurrency} or ${$scope.toCurrency} is not a valid string.`);
            return;
        }
    
        let fromRate = $scope.exchangeRates[$scope.fromCurrency];
        let toRate = $scope.exchangeRates[$scope.toCurrency];
    
        if (!fromRate || !toRate) {
            console.error(`Invalid currency selection: ${$scope.fromCurrency} or ${$scope.toCurrency} not found.`);
            return;
        }
    
        $scope.convertedAmount = ($scope.amount / fromRate) * toRate;
        console.log(`Converted Amount: ${$scope.convertedAmount.toFixed(2)} ${$scope.toCurrency}`);
    
        $scope.$applyAsync();
    };
    
    // Swap currencies function
    $scope.swapCurrencies = function () {
        console.log(`Swapping currencies: ${$scope.fromCurrency} <-> ${$scope.toCurrency}`);

        let temp = $scope.fromCurrency;
        $scope.fromCurrency = $scope.toCurrency;
        $scope.toCurrency = temp;

        // Ensure UI updates before conversion
        $scope.$applyAsync(function () {
            $scope.convertCurrency();
        });
    };

    // Watch for currency selection change and trigger conversion
    $scope.$watch('fromCurrency', function (newValue, oldValue) {
        if (newValue !== oldValue && $scope.exchangeRates[newValue]) {
            console.log(`From currency changed to: ${newValue}`);
            $scope.convertCurrency();
        }
    });

    $scope.$watch('toCurrency', function (newValue, oldValue) {
        if (newValue !== oldValue && $scope.exchangeRates[newValue]) {
            console.log(`To currency changed to: ${newValue}`);
            $scope.convertCurrency();
        }
    });
});
