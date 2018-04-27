# messageTemplate

A customizable message template provider created in AngularJS.

The program is live at https://emilymeuer.github.io/messageTemplate/.

### To run:
 - Select Message, Guest and Company from the drop-down menus.
 - Edit message in the text box.
    _Any parameters from the following list will be replaced by their value for the current guest or company:_
    - firstName
    - lastName
    - roomNumber
    - startTimestamp
    - endTimestamp
    - company
    - city
    - timezone
    - \*greeting*
 - Add a new message by clicking the "New Message" button.
    
### Design decisions:
 - Arrays were my data structure of choice for all lists, as the JSON data was already in array form and arrays interact beautifully with the front end.
 - The "MessageParams.json" file gives the user the freedom to use any parameters in any message, rather than having to define which specific parameters were used for each message.

### Language:
 - AngularJS is a fairly new language for me, and I intially chose it for its data-binding potential, hoping to come up with a clever way to use that to replace variables.  Although this turned out to be more complex than I had anticipated, I decided to stay with Angular even after giving up on that scheme, mainly for its easy interaction with JSON.

### Correctness:
 - I tested each feauture as I went along, naturally, but also made sure to try all possible parameters, as well as changing the Guest and Company files to make sure that the correct error would be alerted if a parameter was missing.

_With more time, I would make the \*greeting\* functionality more robust, with additional time- (and maybe location-)dependent messages._
