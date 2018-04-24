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
        var messagesParamsPromise = $http.get("./public/MessageParams.json");

        $q.all([guestPromise, companiesPromise, messagesPromise, messagesParamsPromise])
            .then((data) => {
                $scope.guests = data[0].data;
                $scope.companies = data[1].data;
                $scope.messages = data[2].data;

                guestReplace = data[3].data.guestReplace;
                companyReplace = data[3].data.companyReplace;
                console.log(data[3].data);

                $scope.updateMessage = () => {
                    // Make sure that to only do this *after* message, guest and company have been selected:

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

                        var replaceWithThis;
                        var regExp;
                        for (var i = 0; i < guestReplaceCopy.length; i++) {
                            replaceWithThis = getAttribute($scope.curGuest, guestReplaceCopy[i][1]);

                            //                            console.log("guest replace this - " + guestReplaceCopy[i][0] + " withThis: " + replaceWithThis);
                            if (replaceWithThis === undefined) {
                                window.alert("Warning: attribute \'" + guestReplaceCopy[i][1] + "\' is undefined for guest \'" + $scope.curGuest.firstName + " " + $scope.curGuest.lastName + "\'; consider editing this message before sending it.");
                            }

                            // Creating a regular expression so that replace() affects *all* occurrances of the variable:
                            regExp = new RegExp(guestReplaceCopy[i][0], "g");
                            curMessageText = curMessageText.replace(regExp, replaceWithThis);
                        } // replace guest params

                        for (var i = 0; i < companyReplaceCopy.length; i++) {
                            if ($scope.curCompany[companyReplaceCopy[i][1]] === undefined) {
                                window.alert("Warning: attribute \'" + companyReplaceCopy[i][1] + "\' is undefined for company \'" + $scope.curCompany.company + "\'; consider editing this message before sending it.");
                            }

                            regExp = new RegExp(companyReplaceCopy[i][0], "g");
                            curMessageText = curMessageText.replace(regExp, $scope.curCompany[companyReplaceCopy[i][1]]);
                        } // replace company params

                        $scope.message = curMessageText;
                    }
                } // updateMessage

                $scope.newMessage = () => {
                    $scope.messages.push({
                        "id": ($scope.messages.length + 1),
                        "message": ""
                    });
                    $scope.curMessage = $scope.messages[$scope.messages.length - 1];
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