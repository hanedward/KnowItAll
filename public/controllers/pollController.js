angular.module("KnowItAll").controller('PollCtrl', ['$scope', '$http','$cookies', '$routeParams', function($scope, $http, $cookies, $routeParams) {
	


	function twoDigits(d) {
	    if(0 <= d && d < 10) return "0" + d.toString();
	    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
	    return d.toString();
	}

	Date.prototype.toMysqlFormat = function() {
    	return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + 
    		   twoDigits(this.getUTCDate()) + " " + twoDigits(this.getHours()) + ":" + 
    		   twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
	};

	var loggedInuserID = $cookies.get("userID");
	$scope.loggedInuserID=loggedInuserID;
	var questionID = $routeParams.questionID;
	var getPoll = true; //check if poll is selected
	//when true, get info from database
	//getting information from search page (Home)
	//(search result controller)

//Set Question ID as URL, and read it when pulling poll / rating information 

	if (getPoll) {
		$http.get('/getQuestion?questionID=' + questionID).then(function (response) {
			$scope.title = response.data[0].title;
			$scope.userID = response.data[0].userID;
			
			$scope.description = null;
			if(response.data[0].description != 'undefined'){
				$scope.description = response.data[0].description;
							
			}

			$scope.isAnonymous = response.data[0].isAnonymous;
			$scope.username = null;

			if($scope.isAnonymous == 1){
				
				$scope.username = "ANONYMOUS";
			}else{
				$scope.username = response.data[0].username;
			}

			$scope.endDate = null;
			if(response.data[0].endDate == null){
				$scope.endDate = "(Open Forever)";
			}else{


				console.log("NOW: " + new Date());
				console.log("CLOSING: " + new Date(response.data[0].endDate));

				//get current time
				var date = new Date();
				//convert close time to match convert time format
				var finalCloseDate = new Date(response.data[0].endDate);
				//newEndDate.setHours(newEndDate.getHours() - newEndDate.getTimezoneOffset() / 60);
				//console.log("NEW END DATE (A): " + newEndDate);
				//var closeDate = (response.data[0].endDate).replace(".000Z", "");
				//var finalCloseDate = closeDate.replace("T", " ");

				console.log("now date: " + date);
				console.log("close date: " + finalCloseDate);
				//compare and check
				if(date < finalCloseDate){
					console.log("ITS NOT CLOSED YET");
					$scope.endDate = response.data[0].endDate;

				}else{
					console.log("IT' CLOSED");
					$scope.endDate = "(CLOSED)";
					// This will disable all the children of the div
					var nodes = document.querySelector(".comments-cont").getElementsByTagName('*');
					for(var i = 0; i < nodes.length; i++){
					     nodes[i].disabled = true;
					}
					var nodes = document.querySelector(".rank-cont").getElementsByTagName('*');
					for(var i = 0; i < nodes.length; i++){
					     nodes[i].disabled = true;
					}					
					var nodes = document.querySelector(".vote-cont").getElementsByTagName('*');
					for(var i = 0; i < nodes.length; i++){
					     nodes[i].disabled = true;
					}
				}
			}
		
			if(response.data.length == 0){
				console.log("response = 0");
			}
		},function (res) {
		    	console.log("Error");
		});

		$http.get('/getLike?questionID=' + questionID).then(function (response) {
			$scope.totalLikeCount = response.data[0].num;

		}, function (response) {
			console.log("Error");
		});	

		$http.get('/getDislike?questionID=' + questionID).then(function (response) {

			$scope.totalDislikeCount = response.data[0].num;

		}, function (response) {
			console.log("Error");
		});	
		

		$http.get('/commentList?questionID=' + questionID).then(function (response) {
			$scope.totalComment = response.data.length;
			$scope.commentList = response.data;
		}, function (response) {
			
		});	
		$http.get('/pollList?questionID=' + questionID).then(function (response) {
			$scope.pollList = response.data;
		}, function (response) {

		});	

	}//If


	//**********************Edit button***********************
	// $scope.editComment = function(){
	// 	console.log("in edit comment");


	//*********************Delete BUtton**********************

	// }

	
}]);