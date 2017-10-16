angular.module("KnowItAll").config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "pages/home.html"
    })
    .when("/profile", {
        templateUrl : "pages/profile.html"
    })
    .when("/login", {
        templateUrl : "pages/login.html",
    })
    .when("/signup", {
        templateUrl : "pages/signUp.html"
    })
    .when("/createPoll", {
        templateUrl : "pages/createPoll.html"
    })
    .when("/createRating", {
        templateUrl : "pages/createRating.html"
    });
});