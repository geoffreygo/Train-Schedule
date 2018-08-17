$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDEv3aM2fYCbKpSS_T8kFtfQ1bakt-w5_A",
    authDomain: "train-schedule-b31c1.firebaseapp.com",
    databaseURL: "https://train-schedule-b31c1.firebaseio.com",
    projectId: "train-schedule-b31c1",
    storageBucket: "train-schedule-b31c1.appspot.com",
    messagingSenderId: "822307029886"
  };
  firebase.initializeApp(config);

  // Variable to hold firebase db
  database = firebase.database();

  // click function to add train to database
  $("#addTrain").on("click", function (event) {
    // prevent default, allow click to be handled by js code
    event.preventDefault();

    // variables to hold the values from the add train form
    var train = $("#train-name").val();
    var first = $("#first-train").val();
    var dest = $("#destination").val();
    var freq = $("#frequency").val();

    // push the variables to the db as an object
    database.ref().push({
      train: train,
      firstTrain: first,
      destination: dest,
      frequency: freq,
    })

    // clear out the form fields
    $("#train-name").val("");
    $("#first-train").val("");
    $("#destination").val("");
    $("#frequency").val("");

  })

  // function to run when record is added to the db, also runs on load of the site once for each db record
  database.ref().on("child_added", function (snapshot) {

    // variable to hold the time of the first train
    var first = moment(snapshot.val().firstTrain, "HH:mm").subtract(1, "years");
    // variable to hold frequency (in minutes)
    var freq = snapshot.val().frequency;
    // variable to hold the number of minutes between the first train and now
    var diff = moment().diff(moment(first), "minutes");
    // remainder of number of minutes since first train divided by the frequency in number of minutes
    var remainder = diff % freq;
    // minutes until next train equals the frequency - the remainder
    var minsTilTrain = freq - remainder;
    // time of next train equals now added to the minutes until the next train
    var nextTrain = moment().add(minsTilTrain, "minutes");
    // wrap up the necessary variables/values in html as table data in a new row
    var newRow = "<tr><td>" + snapshot.val().train + "</td><td>" + snapshot.val().destination + "</td><td>" + snapshot.val().frequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + minsTilTrain + "</td></tr>";
    //add the new row to the table
    $("#sched-rows").append(newRow);
  })

  function refresh() {
    if (!($("#train-name").val()==="")) {
      console.log($("#train-name"));
      return;
    } else {
      location.reload();
    };
  }

  setInterval(refresh, 60000);
})