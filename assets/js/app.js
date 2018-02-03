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

function timeUpdate () {
  $('#currentTime').text(moment().format('hh:mm a'));
};

function validateForm () {
  var a = $('#tName').val().trim();
  var b = $('#tDest').val().trim();
  var c = $('#tFirstTime').val().trim();
  var d = $('#tFreq').val().trim();
  if (a == "") {
    $('#formAlert').html('<strong>Whoops!</strong> What is the train\'s name?').show();
    return false;
  } else if (b == "") {
    $('#formAlert').html('<strong>Yikes!</strong> Where is the train going?').show();
    return false;
  } else if (c == "") {
    $('#formAlert').html('<strong>Uh oh!</strong> When does the first train arrive?').show();
    return false;
  } else if (d == "") {
    $('#formAlert').html('<strong>Umm..</strong> How often does the train arrive?').show();
    return false;
  } else {
    return true;
  }};

$( document ).ready(function() {
  timeUpdate();
  setInterval(timeUpdate, 60000);
});

$('#submit').click(function(event){
  event.preventDefault();
  if (validateForm()) {
    $('#formAlert').hide();
    timeUpdate();
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
  }
});

$('#clear').click(function(event){
  database.ref("/trains").remove();
  $('.table').html('<thead><tr><th>Train Name</th><th>Destination</th><th>Frequency</th><th>Next Arrival</th><th>Minutes Away</th></tr></thead><tbody id="trainSchedule"></tbody>');
});

database.ref("/trains").on("child_added", function(childSnapshot) {
  var wholeEntry = $('<tr>')
  var entryName = $('<td>');
  entryName.text(childSnapshot.val().name);
  var entryDest = $('<td>');
  entryDest.text(childSnapshot.val().dest);
  var entryFreq = $('<td>');
  entryFreq.text(childSnapshot.val().freq + " minutes");

  var entryFT = moment(childSnapshot.val().firstTime, 'HH:mm').format('hh:mm');
  var entryFTConverted = moment(entryFT, "hh:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(entryFTConverted), "minutes");
  var tRemainder = diffTime % (childSnapshot.val().freq);
  var tMinutesTillTrain = (childSnapshot.val().freq) - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");

  var entryNext = $('<td>');
  entryNext.text(moment(nextTrain).format("hh:mm a"));
  var entryMin = $('<td>');
  entryMin.text(tMinutesTillTrain + " minutes");

  wholeEntry.append(entryName, entryDest, entryFreq, entryNext, entryMin);
  $('#trainSchedule').append(wholeEntry);
});