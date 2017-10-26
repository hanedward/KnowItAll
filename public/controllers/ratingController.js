angular.module("KnowItAll").controller('RatingCtrl', ['$scope', '$http', '$cookies', '$routeParams', '$location', function($scope, $http, $cookies, $routeParams, $location) {
	

	var questionID = $routeParams.questionID;
	console.log("question ID is " + questionID);
	var userID = $cookies.get("userID");
	console.log("in rate ctrl"); 
	var getRating = true;

	if (getRating) {
		console.log("getting rating");

		$http.get('/getQuestion?questionID=' + questionID).then(function (response) {
			console.log("Got rating info");
			console.log(response.data[0]);
			$scope.title = response.data[0].title;
			$scope.userID = response.data[0].userID;
			$scope.description = response.data[0].description;
			$scope.endDate = response.data[0].endDate;

			if(response.data.length == 0){
				console.log("response = 0");
			}
		},function (res) {
		    	console.log("Error");
		});

		$http.get('/commentList?questionID=' + questionID).then(function (response) {
		console.log("got comments ");
		console.log(response.data);
		$scope.commentList = response.data;
		}, function (response) {
			console.log("Failed to get current user, not logged in");
		});
	
	}
	
}]);