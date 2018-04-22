"use strict";

/*
    Emily Meuer
    04/15/2018

    Customizable message template provider, using AngularJS
*/

(function() {
    var app = angular.module("app", []);

    console.log("Are we here at all?");

// Host this and grab by http when I get on wi-fi: (or check w/jquery?)
    var guests = [
      {
        "id": 1,
        "firstName": "Candy",
        "lastName": "Pace",
        "reservation": {
          "roomNumber": 529,
          "startTimestamp": 1486654792,
          "endTimestamp": 1486852373
        }
      },
      {
        "id": 2,
        "firstName": "Morgan",
        "lastName": "Porter",
        "reservation": {
          "roomNumber": 385,
          "startTimestamp": 1486612719,
          "endTimestamp": 1486694720
        }
      },
      {
        "id": 3,
        "firstName": "Bridgett",
        "lastName": "Richard",
        "reservation": {
          "roomNumber": 141,
          "startTimestamp": 1486520344,
          "endTimestamp": 1486769616
        }
      },
      {
        "id": 4,
        "firstName": "Melisa",
        "lastName": "Preston",
        "reservation": {
          "roomNumber": 417,
          "startTimestamp": 1486614763,
          "endTimestamp": 1486832543
        }
      },
      {
        "id": 5,
        "firstName": "Latoya",
        "lastName": "Herrera",
        "reservation": {
          "roomNumber": 194,
          "startTimestamp": 1486605110,
          "endTimestamp": 1486785126
        }
      },
      {
        "id": 6,
        "firstName": "Hewitt",
        "lastName": "Hopper",
        "reservation": {
          "roomNumber": 349,
          "startTimestamp": 1486660637,
          "endTimestamp": 1486788273
        }
      }
  ];

  var companies = [
    {
      "id": 1,
      "company": "Hotel California",
      "city": "Santa Barbara",
      "timezone": "US/Pacific"
    },
    {
      "id": 2,
      "company": "The Grand Budapest Hotel",
      "city": "Republic of Zubrowka",
      "timezone": "US/Central"
    },
    {
      "id": 3,
      "company": "The Heartbreak Hotel",
      "city": "Graceland",
      "timezone": "US/Central"
    },
    {
      "id": 4,
      "company": "The Prancing Pony",
      "city": "Bree",
      "timezone": "US/Central"
    },
    {
      "id": 5,
      "company": "The Fawlty Towers",
      "city": "Torquay",
      "timezone": "US/Eastern"
    }
];

    var messages = [
      {
        "message": " {{ greeting }}, {{ firstName }}, and welcome to {{ hotel }}! Room {{ roomNumber }} is now ready for you.  Enjoy your stay, and let us know if you need anything."
    }
    ]



    // Controllers to fill the tables

    // Select a template

    // The template will require that particular variables be filled in correctly
    // (e.g., firstName, lastName, hotel);
    // How will I know which variables I need?  Or - I could fill all of them!
    // $scope.firstName = guest.firstName; etc.

    // Maybe I'll let them select this guest graphically:
    var guestId = 1;

    app.controller("MessageController", function($scope, $http) {

        console.log("In the MessageController");
/*
        $http.get("http://localhost:8013/Guests.json")
        .then(function (response) {
            // Success!
            console.log(response);
        }, function (response) {
            // Error:
            console.log("messageTemplate/app.js: caught an error trying to get information for guest " + guestId + "; response = " + response);
        });
        */

        var curGuest;

        for(var i = 0; i < guests.length; i++)
        {
            if(guests[i].id == guestId) {   curGuest    = guests[i];    }

        } // for
        if(curGuest == null)
        {
            console.log("Hmm, couldn't find guest with id " + guestId + ".");
        }

        console.log("curGuest.firstName = " + curGuest.firstName);

        $scope.me   = "Emily";

        console.log("$scope.firstName = " + $scope.firstName);

//        var messages    = $http.jsonp("https://emilymeuer.github.io/messageTemplate/Messages.json").
        var messages    = $http.get("./Messages.json").
            then( (response) => {
                console.log("Success getting Messages");
                console.log(response.data[0]);
                var messageElement = document.querySelector("#message").innerHTML  = "<p ng-bind=\"greeting\" ng-controller=\"InnerController\">" + response.data[0].message + "</p>";
            //    messageElement.greeting = "Hi";
            /*    $scope.controller = ("trueInnerController", ($scope) => {
                    $scope.greeting = "Hello";
                });
                */
                $scope.greeting = "Hello";
                console.log($scope);
//                $scope.apply();
//                $scope.message  = innerController;
            }, (error) => {
                console.log("Error getting Messages");
                console.log(error);
            });
//        var message    = messages[0].message;
//        console.log("message.firstName = " + message.firstName);


        // New plan:
        // There's some sort of replace;
        // I'm going to include the variables that need to be replaced
        // in the JSON (either as keys or as an array - prob the latter).

        // I'll use the replace from cal

    }); // MessageController


        var innerController = app.controller("InnerController", function($scope) {
            $scope.greeting = "Hello";
        });
})();
