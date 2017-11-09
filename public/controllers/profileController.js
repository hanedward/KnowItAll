angular.module("KnowItAll").controller('ProfileCtrl', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
	var username = null;
	var loggedIn = true;

	console.log("In profile controller");

	$scope.createProfilePic = function() {

		console.log("ITS CALLED");
		var picURL = document.querySelector("#pictureURL").value;
		document.querySelector("#profile-pic").src = picURL;
	}

	if ($cookies.get("username") != null && $cookies.get("username") != 'null') {
		$scope.loggedInMessage = "";
		username = $cookies.get("username");
	} else {
		$scope.loggedInMessage = "You must be logged in to access your profile";
		loggedIn = false;
		var image = document.getElementById("profile-pic");
		image.style.display = "none";
		var imageTextField = document.getElementById("pictureURL");
		imageTextField.style.display = "none";
		var imageButton = document.getElementById("imageButton");
		imageButton.style.display = "none";
	}
	
	if (loggedIn) {
	
		var image = document.getElementById("profile-pic");
		image.style.display = "intial";
		var imageTextField = document.getElementById("pictureURL");
		imageTextField.style.display = "initial";
		var imageButton = document.getElementById("imageButton");
		imageButton.style.display = "initial";

		console.log("You are logged in");

		$http.get('/profile?username=' + username).then(function (response) {
		$scope.questionList = response.data;
		}, function (response) {
			console.log("Failed to get current user, not logged in");
		});


		document.querySelector("#profile-pic").src = "../img/blankprofile.png";
		console.log("dynamically creating profile pic");
	}
}]);