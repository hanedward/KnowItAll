angular.module("KnowItAll").controller('pollRatingCtrl', ['$scope', '$http', '$cookies', '$routeParams', function($scope, $http, $cookies, $routeParams) {
	
	var userID = $cookies.get("userID");
	console.log("in poll/rate ctrl"); 
	var questionID = "1";

	$scope.createComment = function(){

		if(!userID){
			var validComment = validate($scope.commentInput); 

			if(!validComment){
				$scope.errorMessageComment = "Please leave a comment";
			}
			else{ 
				var Anonymous = $scope.isAnonymousInput;
				var comment =  $scope.commentInput;
				//var userID = 1; //needs to be the current logged in User 

				console.log("question ID:" + questionID);
				console.log("description:"+ comment);
				console.log("Anonymous" +Anonymous);
		 		
				$http.get("/insertComment?questionID=" + questionID + "&userID=" + userID
					+ "&description=" + comment)
					.then(function (response) {
						console.log("inser into comment table");
		 
				},function (response) {
				    	console.log("Error");
				});
			}
		}
		else{
			$scope.errorMessageComment = "Please log In to comment";
		}

	}

	$scope.selectRate = function(){

		if(!userID){

			var validRating = validate($scope.rateInput); 

			if(!validRating){
				$scope.errorMessageRate = "Please choose the rating value";
			}
			else{
				var ratingValue = $scope.rateInput;
				//find Rating and put the value into RatingQuestionOption
				$http.get("/insertRatingValue?questionID=" + questionID + "&userID=" + userID
					+ "&rating=" + ratingValue)
					.then(function (response) {
						console.log("inser into comment table");
		 
				},function (response) {
				    	console.log("Error");
				});
			}
		}
		else{
			$scope.errorMessageRate = "Please log In to rate";
		}
	}

	$scope.selectLikeOrDislike = function(){

		if(!userID){

			var validLike = validate($scope.likeInput); 

			if(!validLike){
				$scope.errorMessageLike = "Please choose the like/dislike value";
			}
			else{
				var likeorDisLike = $scope.likeInput;
				//like ans true and dislike as false
				console.log("Poll like/dislike value is " + likeorDisLike);
				//var userID = 1; //needs to be the current logged in User 

				$http.get("/QuestionLike?questionID=" + questionID + "&userID=" + userID
					+ "&pollLike=" + likeorDisLike)
					.then(function (response) {
						console.log("insert into questionlike table");
				},function (response) {
				    	console.log("Error");
				});
			}
		}else{
			$scope.errorMessageLike = "Please log In to like/dislike";
		}
	}

	function validate(input){
		if(input == null || input == ""){
			//alert("error"); 
			return false; 
		}
		return true; // success
	}


}]);