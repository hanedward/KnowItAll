angular.module("KnowItAll").controller('ProfileCtrl', ['$scope', '$http', '$cookies', '$location', '$window', function($scope, $http, $cookies, $location, $window) {
	var username = null;
	var loggedIn = true;
	var userID = $cookies.get("userID");
	$scope.notify = {message : ""};

	// $scope.createProfilePic = function() {
	// 	console.log("ITS CALLED");
	// 	var picURL = document.querySelector("#pictureURL").value;
	// 	document.querySelector("#profile-pic").src = picURL;
	// }

	if ($cookies.get("username") != null && $cookies.get("username") != 'null') {
		$scope.loggedInMessage = "";
		username = $cookies.get("username");
		$scope.username = username
	} else {
		$scope.loggedInMessage = "You must be logged in to access your profile";
		loggedIn = false;
		// var image = document.getElementById("profile-pic");
		// image.style.display = "none";
		// var imageTextField = document.getElementById("pictureURL");
		// imageTextField.style.display = "none";
		// var imageButton = document.getElementById("imageButton");
		// imageButton.style.display = "none";
	}
		
	if (loggedIn) {
		var image = document.getElementById("profile-pic");
		image.style.display = "intial";
		var imageTextField = document.getElementById("pictureURL");
		imageTextField.style.display = "initial";
		// var imageButton = document.getElementById("imageButton");
		// imageButton.style.display = "initial";

		//console.log("You are logged in");

		// feed
		$http.get('/profile?username=' + username)
			.then(function (response) {
					$scope.questionList = response.data;
					return response.data; 
				}, function (response) {
					console.log("Failed to get current user, not logged in");
			}).then(function(response){ 
				var list = response;
				for(var i=0; i<list.length; i++){
					var current = list[i]; 
					// username
					if(current.isAnonymous == 1) current.username = "anonymous";
					else getUsername(current);
					// end date
					if (current.endDate == null) {
						current.endDateDisplay = "Open Forever"; 
					} else {
						var date = new Date();
						var finalCloseDate = new Date(current.endDate);
						if (date < finalCloseDate) { 
								current.endDateDisplay = "Open until " + convertDay(finalCloseDate) ; 
						} else { 
							current.endDateDisplay = "CLOSED"; 
						}
					}
					// tags
					getTags(current); 
				} // end of for loop
			}
		);

		$http.get('/numFollowers?username=' + username).then(function(response) {
			$scope.numFollowers = response.data[0].numFollowers;
			$scope.numFollowing = response.data[0].numFollowing;
		});

		// bio and imageURL
		$http.get('/getUserInfo?username=' + username).then(function(response) {
			var bio = response.data[0].bio; 
			if(bio) $scope.bio = bio; 
	
			var imageURL = response.data[0].imageURL; 
			if(imageURL) $scope.imageURL = imageURL;
			else $scope.imageURL = "img/blankprofile.png";
		});

		function convertDay(endDate){
			var month = endDate.getUTCMonth() + 1; 
			var day = endDate.getUTCDate();
			var year = endDate.getUTCFullYear();
			newdate = month + "/" + day + "/" + year;
			return newdate
		}

		function getUsername(current){
			$http.get('/getUserName?userID=' + current.userID)
				.then(function (response) {
						current.username = response.data[0].username;
					}, function (response) {
						console.log("FAILED getting username");
				}
			);
		}

		function getTags(current){
			$http.get('/getQuestionTags?questionID=' + current.questionID)
				.then(function (response) {
						var tags = [];
						for(var i=0; i<response.data.length; i++){
							tags.push({
								tagStr: response.data[i].tagStr
							});
						}
						current.allTags = tags; 
					}, function (response) {
						console.log("FAILED getting tags");
				}
			);
		}
	}


	$scope.goToLink = function(question) {
		console.log("In go to link in ProfileCtrl");
        if(question.isPoll){
             $location.path('/poll/' + question.questionID);
        }
        else{
            $location.path('/rating/' + question.questionID);
        }
    };

    $scope.editProfile = function () { 
    	// update bio 
    	var newBio = $scope.updatedBioInput; 
    	if(newBio){
    		// check if new Bio wthin character limit
    		var len = newBio.toString().length; 
    		if(len > 100){
    			console.log("new bio has more than 100 characters");
    		} else {
    			document.getElementById("bio").innerHTML = newBio;
		    	$http.get('/updateBio?userID=' + userID + "&bio=" + newBio).then(function (response) {
		            }, function (response) { console.log("FAILED updateBio");}
			    );
    		}
    	}

    	var newImageURL = $scope.updatedImageURLInput; 

    	if(newImageURL){ 
    		if(checkURL(newImageURL)){
    			if(newImageURL.length < 2000){
    				document.querySelector("#profile-pic").src = newImageURL
			    	$http.get('/updateProfilePic?userID=' + userID + "&imageURL=" + newImageURL).then(function (response) {
			            }, function (response) { console.log("FAILED updateProfilePic");}
				    );
    			}
    		} else {
    			console.log("invalid url");
    		}	
    	}

    	function checkURL(url) {
	    	return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
		}
    }

    $scope.deactivateAccount = function () {

    	var deactivated = true;
    	$scope.userID = $cookies.get('userID');
    	$scope.username = $cookies.get('username');

    	$http.get('/deactivateUser?deactivated=' + deactivated + '&userID=' + $scope.userID + "&username=" + $scope.username)
    		.then(function (response) {
    			console.log("deactivating account for: " + $scope.username);
    		}
    	);
    	$http.get('/deactivateQuestions?userID=' + $scope.userID)
    		.then(function (response) {
    			console.log("deactivating questions for: " + $scope.username);
    		}
    	);
    	$http.get('/deactivateComments?userID=' + $scope.userID)
    		.then(function (response) {
    			console.log("deactivating comments for: " + $scope.username);
    		}
    	);


    	$cookies.put("username", null);
        $cookies.put("userID", -1);
        $cookies.put("isAdmin", false);
        $cookies.put("isDeactivated", true);
        $window.location.replace("#!login");

        // After redirected to login page and after it loads, display a modal for the user with a message
		// $(document).ready(function () {
		//     $("#deactivateLoginModal").modal('show');
		// });
    }

    $scope.showPopUpForDeletingPost = function(question){
    	var questionID = question.questionID;
    	$scope.deleteQuestionID = questionID;
    	$("#deletePostModal").modal('show');
    }

	$scope.deletePost = function() {
		console.log("In deletePost in ProfileCtrl");
        
		console.log("QUESTIONID: " + $scope.deleteQuestionID);

    	$http.get('/deletePost?questionID=' + $scope.deleteQuestionID)
    		.then(function (response) {
    			//redirect to profile
    			console.log("SUCCESS deleting Post "); 
    			$window.location.reload();
    			console.log("CALLED");
    		}, function (response) {
	            console.log("FAILED deleting post");
	        }
    	);
    }
    
	$scope.deleteAllPosts = function() {
		console.log("In deletePost in ProfileCtrl");
        
		console.log("USER ID: " + $cookies.get("userID"));
		var userID = $cookies.get("userID");

    	$http.get('/deleteAllPosts?userID=' + userID)
    		.then(function (response) {
    			//redirect to profile
    			$window.location.reload();
    			console.log("SUCCESS deleting All Posts"); 
    		}, function (response) {
	            console.log("FAILED deleting all posts");
	        }
    	);
    }

    $scope.getUnreadNotifications = function() {
    	var userID = $cookies.get("userID");
    	$scope.notifications = {notificationList : [] };

    	$http.get('/getNotifications?userID=' + userID + '&read=0')
    	.then(function (response) {
    		$scope.notifications.notificationList = response.data;
    	});
    }

    $scope.markAsRead = function(notification, notificationList, index) {
    	console.log("Marking as read");
    	var notification = angular.copy(notification)
    	var notificationID = notification.userNotificaitonID;

    	console.log(notification);
    	$http.get('/markNotificationAsRead?id=' + notificationID);
    	notificationList.splice(index, 1);
    }

    $scope.notifyImmediatly = function() {
    	console.log("notification settings changed to immediate");
    	var id = $cookies.get("userID");
    	$http.get('/toggleNotificaitons?userID=' + userID + '&notifyHourly=' + 0);
    	$scope.notify = {message : "Your notificaitons have been set to immediate"};
    }

    $scope.notifyHourly = function() {
    	var id = $cookies.get("userID");
    	$http.get('/toggleNotificaitons?userID=' + userID + '&notifyHourly=' + 1);
    	$scope.notify = {message : "Your notificaitons have been set to hourly"};
    }

}]);

