  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCheowTlssv5Oy6qR1bvrSuXmldwwF3VtM",
    authDomain: "train-scheduler-4005c.firebaseapp.com",
    databaseURL: "https://train-scheduler-4005c.firebaseio.com",
    projectId: "train-scheduler-4005c",
    storageBucket: "train-scheduler-4005c.appspot.com",
    messagingSenderId: "594644763872"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // on click pull the whole form data and push it to the firebase
  $('#submit').click(function(event){
    event.preventDefault();
    var name = $('#tName').val().trim();
    var dest = $('#tDest').val().trim();
    var firstTime = $('#tFirstTime').val().trim();
    var freq = $('#tFreq').val().trim();
    database.ref("/trains").push({
      name: name,
      dest: dest,
      firstTime: firstTime,
      freq: freq,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    })
    $('#tName').val("");
    $('#tDest').val("");
    $('#tFirstTime').val("");
    $('#tFreq').val("");
  });

  database.ref("/trains").on("child_added", function(childSnapshot) {
    var wholeEntry = $('<tr>')
    var entryName = $('<td>');
    entryName.text(childSnapshot.val().name);
    var entryDest = $('<td>');
    entryDest.text(childSnapshot.val().dest);
    var entryTime = $('<td>');
    entryTime.text(childSnapshot.val().firstTime);
    var entryFreq = $('<td>');
    entryFreq.text(childSnapshot.val().freq);
    wholeEntry.append(entryName, entryDest, entryTime, entryFreq);
    $('#trainSchedule').append(wholeEntry);
  })


// -----THIS IS AN EXAMPLE TO CALCULATE THE TRAIN ARRIVAL DIFFERENCE ----------
    // // Assumptions
    // var tFrequency = 3;

    // // Time is 3:30 AM
    // var firstTime = "03:30";

    // // First Time (pushed back 1 year to make sure it comes before current time)
    // var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // // Current Time. Can this not be accomplished without declaring a variable? moment().format("hh:mm");
    // var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // // Difference between the times
    // var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // // Time apart (remainder)
    // var tRemainder = diffTime % tFrequency;
    // console.log(tRemainder);

    // // Minute Until Train
    // var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // // Next Train
    // var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));