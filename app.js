"use strict";

/*
    Emily Meuer
    04/15/2018

    Customizable message template provider, using AngularJS
*/

(function() {
	var app = angular.module("app", []);

	var guestReplace;
	var companyReplace;

	// These are used to replace the *greeting* variable in relation to the guest's startTimestamp:
	var greeting = [
		"Good morning",
		"Good morning",
		"Good afternoon",
		"Good evening"
	];

	app.controller("MessageController", function($scope, $http, $q, $filter) {

		// Load the template, Guest and Company data:
		var guestPromise = $http.get("./public/Guests.json");
		var companiesPromise = $http.get("./public/Companies.json");
		var messagesPromise = $http.get("./public/Messages.json");
		var messagesParamsPromise = $http.get("./public/MessageParams.json");

		$q.all([guestPromise, companiesPromise, messagesPromise, messagesParamsPromise])
			.then((data) => {
				// The following fills out the data-binding in index.html:
				$scope.guests = data[0].data;
				$scope.companies = data[1].data;
				$scope.messages = data[2].data;

				// These contain the placeholder variables that could be used in a message:
				guestReplace = data[3].data.guestReplace;
				companyReplace = data[3].data.companyReplace;

				// Replaces the guest and company variables in message:
				$scope.updateMessage = () => {

					// Make sure to only do this after message, guest and company
					// have been selected (lest the attempt to access them cause errors):
					if ($scope.curMessage != undefined &&
						$scope.curGuest != undefined &&
						$scope.curCompany != undefined) {

						// Making copies ensures that shifting the elements in
						// getAttribute() will not affect future events:
						var guestReplaceCopy = [];
						angular.copy(guestReplace, guestReplaceCopy);
						var companyReplaceCopy = [];
						angular.copy(companyReplace, companyReplaceCopy);
						var curMessageText = $scope.curMessage.message;

						// Get the value of each variable for this particular guest
						// and replace in the message:
						var replaceWithThis;
						var regExp;
						for (var i = 0; i < guestReplaceCopy.length; i++) {
							replaceWithThis = getAttribute($scope.curGuest, guestReplaceCopy[i][1]);

							// Want to make sure that the guest does indeed have data for this variable:
							if (replaceWithThis === undefined) {
								window.alert("Warning: attribute \'" + guestReplaceCopy[i][1] + "\' is undefined for guest \'" + $scope.curGuest.firstName + " " + $scope.curGuest.lastName + "\'; consider editing this message before sending it.");
							}

							// Creating a regular expression so that replace() affects *all* occurrances of the variable:
							regExp = new RegExp(guestReplaceCopy[i][0], "g");
							curMessageText = curMessageText.replace(regExp, replaceWithThis);
						} // replace guest params

						// (Same as above, but for the company vars rather than the guest vars.)
						for (var i = 0; i < companyReplaceCopy.length; i++) {
							if ($scope.curCompany[companyReplaceCopy[i][1]] === undefined) {
								window.alert("Warning: attribute \'" + companyReplaceCopy[i][1] + "\' is undefined for company \'" + $scope.curCompany.company + "\'; consider editing this message before sending it.");
							}

							regExp = new RegExp(companyReplaceCopy[i][0], "g");
							curMessageText = curMessageText.replace(regExp, $scope.curCompany[companyReplaceCopy[i][1]]);
						} // replace company params

						// Replace the greeting:
						var time = getAttribute($scope.curGuest, ["reservation", "startTimestamp"]);
						var hour = $filter("date")(time, "H", getAttribute($scope.curCompany, ["timezone"]));
						// Morning: 0-(12); Afternoon: 12-(18); Evening: 18-(24)
						var curGreeting = greeting[Math.floor(hour / 6)];

						regExp = new RegExp("\\*greeting\\*", "g");
						curMessageText = curMessageText.replace(regExp, curGreeting);

						// Bind:
						$scope.message = curMessageText;
					}
				} // updateMessage

				// Add a new, empty message:
				$scope.newMessage = () => {
					$scope.messages.push({
						"id": ($scope.messages.length + 1),
						"message": ""
					});
					// ... and set it as the current message so we can start editing it right away:
					$scope.curMessage = $scope.messages[$scope.messages.length - 1];
				} // newMessage
			});
	}); // MessageController

	/*
	    Returns the value of the given attribute for a given element.
	    Attributes are passes as a string array;
	    each level of a nested attribute is an element in the array - for example,
	     reservation.roomNumber would be [ "reservation", "roomNumber" ],
	     student.currentSemester.numCourses would be [ "student", "currentSemester", "numCourses" ].
	*/
	function getAttribute(element, attributes) {
		if (attributes.length === 0) {
			throw "app.getAttribute: array parameter has length 0; must contain at least 1 element.";
		}
		// End condition:
		if (attributes.length === 1) {
			return element[attributes[0]];
		}

		// Pull out the first attribute,
		// use it to get into the next level of the element,
		// and send that smaller element/list of attributes through again:
		element = element[attributes.shift()];
		return getAttribute(element, attributes);
	} // getAttribute

})();