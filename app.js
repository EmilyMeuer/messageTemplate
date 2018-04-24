"use strict";

/*
    Emily Meuer
    04/15/2018

    Customizable message template provider, using AngularJS

    TODO
    - perfect world:
        - clean up "clear___" and textarea field on size change
    - necessary:
        - "Edit message" button / input field
            - Find next id
            - "New Message" should automatically update curMessage, too
            - Disable "Save Changes" on (no difference between inputText and curMessage)
            - But then make "Save Changes" take effect (that is - replace variables!)
        - comment it up!
    - done:
        - roomNumber
        - ^ Link $scope.curGuest and $scope.curCompany (and curMessage) to dropdown selects
        - "Update message" button (or do this automatically)
        - error messages show up on the page (not just console.error)

*/

(function() {
    var app = angular.module("app", []);

    var guestId = 1;
    var companyId = 1;
    //    var curMessagePos = 0;
    var guestReplace;
    var companyReplace;

    app.controller("MessageController", function($scope, $http, $q) {

        var guestPromise = $http.get("./public/Guests.json");
        var companiesPromise = $http.get("./public/Companies.json");
        var messagesPromise = $http.get("./public/Messages.json");

        $q.all([guestPromise, companiesPromise, messagesPromise])
            .then((data) => {
                $scope.guests = data[0].data;
                $scope.companies = data[1].data;
                $scope.messages = data[2].data;

                guestReplace = $scope.messages[0].guestReplace;
                companyReplace = $scope.messages[0].companyReplace;

                $scope.updateMessage = () => {
                    // Make sure that to only do this *after* message, guest and company have been selected:
                    if ($scope.curMessage != undefined &&
                        $scope.curGuest != undefined &&
                        $scope.curCompany != undefined) {

                        // Making copies ensures that shifting the elements in
                        // getAttribute() will not affect future events:
                        var guestReplaceCopy = [];
                        angular.copy($scope.curMessage.guestReplace, guestReplaceCopy);
                        var companyReplaceCopy = [];
                        angular.copy($scope.curMessage.companyReplace, companyReplaceCopy);
                        var curMessageText = $scope.curMessage.message;

                        var replaceWithThis;
                        for (var i = 0; i < guestReplaceCopy.length; i++) {
                            replaceWithThis = getAttribute($scope.curGuest, guestReplaceCopy[i][1]);

                            if (replaceWithThis === undefined) {
                                window.alert("Warning: attribute \'" + guestReplaceCopy[i][1] + "\' is undefined for guest \'" + $scope.curGuest.firstName + " " + $scope.curGuest.lastName + "\'; consider editing this message before sending it.");
                            }

                            curMessageText = curMessageText.replace(guestReplaceCopy[i][0], replaceWithThis);
                        }

                        for (var i = 0; i < companyReplaceCopy.length; i++) {
                            if ($scope.curCompany[companyReplaceCopy[i][1]] === undefined) {
                                window.alert("Warning: attribute \'" + companyReplaceCopy[i][1] + "\' is undefined for company \'" + $scope.curCompany.company + "\'; consider editing this message before sending it.");
                            }

                            curMessageText = curMessageText.replace(companyReplaceCopy[i][0], $scope.curCompany[companyReplaceCopy[i][1]]);
                        }

                        $scope.message = curMessageText;
                    }
                } // updateMessage

                $scope.newMessage = () => {
                    $scope.curMessage = $scope.messages.push({
                        "id": 20,
                        "message": ""
                    });
                } // newMessage
            });
    }); // MessageController

    function getAttribute(element, attributes) {
        if (attributes.length === 0) {
            throw "app.getAttribute: array parameter has length 0; must contain at least 1 element.";
        }
        if (attributes.length === 1) {
            return element[attributes[0]];
        }

        element = element[attributes.shift()];
        return getAttribute(element, attributes);
    } // getAttribute

})();