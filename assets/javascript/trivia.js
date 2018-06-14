var rightOne = "";
var rightID = 4;
var intervalId;
var wins = 0;
var losses = 0;
var challenge = ["medium", "hard"];
var category = [9, 17, 18, 19, 20, 22, 23, 27];
var token = "";
// prevents the clock from being sped up unnecessarily
var clockRunning = false;

// Our stopwatch object
var stopwatch = {

  time: 0,
  preset: 30,
  reset: function() {
    stopwatch.stop();
    stopwatch.time = 0;
    // DONE: Change the "display" div to "00:00."
    $("#timerCountDown").text("00s");
  },
  start: function() {

    // DONE: Use setInterval to start the count here and set the clock to running.
    if (!clockRunning) {
      intervalId = setInterval(stopwatch.count, 1000);
      clockRunning = true;
      $("#timerCountDown").text("30s");
    }
  },
  stop: function() {
    
    // DONE: Use clearInterval to stop the count here and set the clock to not be running.
    clearInterval(intervalId);
    clockRunning = false;
  },
  count: function() {

    // DONE: increment time by 1, remember we cant use "this" here.
    stopwatch.time++;

    // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
    //       and save the result in a variable.
    var converted = stopwatch.timeConverter(stopwatch.preset - stopwatch.time);

    // DONE: Use the variable we just created to show the converted time in the "display" div.
    $("#timerCountDown").text(converted);
    if(converted == "00s") {
        losses++;
        stopwatch.reset();
        loadScreen("Loss");
    }
    },
  timeConverter: function(t) {

    var seconds = t;

    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return seconds + "s";
  }
};

//
function jumbleArray(array){
    var temp = [0,0,0,0];
    var random = [false, false, false, false];
        for(var i = 0; i < array.length; i++){
            var rand = Math.floor(Math.random()*array.length);
            switch(rand){
                case 0:
                    if(!random[0]){
                        random[0] = true;
                        temp[i] = decodeHtml(array[rand]);
                    }
                    else i--;
                    break;
                case 1:
                    if(!random[1]){
                        random[1] = true;
                        temp[i] = decodeHtml(array[rand]);
                    }
                    else i--;
                    break;
                case 2:
                    if(!random[2]){
                        random[2] = true;
                        temp[i] = decodeHtml(array[rand]);
                    }
                    else i--;
                    break;
                case 3:
                    if(!random[3]){
                        random[3] = true;
                        temp[i] = decodeHtml(array[rand]);
                    }
                    else i--;
                    break; 
            }
            
        }
    return temp;
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    var text = txt.value;
    txt.remove();
    return text;
}
function loadAjax(key){
    token = key;
}
function resetToken(){
    $.ajax({
        url: "https://opentdb.com/api_token.php?command=reset&token=" + token,
        method: "GET"
    })
}
function loadTrivia(){
    var subject = category[Math.floor(Math.random()* category.length)];
    var difficulty = challenge[Math.floor(Math.random()* challenge.length)];
    var queryURL = "https://opentdb.com/api.php?amount=1&category=" + subject + "&difficulty=" + difficulty + "&type=multiple&token=" + token;
    
    $.ajax({
        url: queryURL, 
        method: "GET"
    }).then(function(response){

        if(response.response_code == 4) resetToken();
        var question = decodeHtml(response.results[0].question);
        var wrongOnes = response.results[0].incorrect_answers;
        rightOne = decodeHtml(response.results[0].correct_answer);
        var holder = [wrongOnes[0], wrongOnes[1], wrongOnes[2], rightOne];
        var answers = jumbleArray(holder);
        
    var newList = $("<ol>");
    $(".trivia").empty();
    $(".placeholder").empty();

    for(var i=1; i<=4; i++){
        var listItem = $("<li>");
        listItem.addClass("list" + i);
        newList.append(listItem);

        var listButton = $("<button>");
        listButton.addClass("answer");
        listButton.attr("id", "option"+i);
        listButton.attr("data-name", "Option " + i);
        listButton.text(answers[i-1]);
        if (answers[i-1] === rightOne) rightID = i;
        listItem.append(listButton);    
    }
    $("#triviaQuestion").text(question);
    $(".trivia").append(newList);
    stopwatch.reset();
    stopwatch.start();
    });
}

function loadScreen(string, target){
    
    var newImg = $("<img>");
    $(newImg).addClass("imgStatus");

    if (string === "Win"){
        $("#triviaQuestion").text("You Got It Right! Way To Go!");
        $(newImg).attr("src", "");
        $(target).attr("style", "border: 5px solid green");
    }
    else {
        $("#triviaQuestion").text("Sorry! That is Incorrect!" );
        $(newImg).attr("src", "");
        $(target).attr("style", "border: 5px solid red");
        $("#option"+rightID).attr("style", "border: 5px solid green");
    }
    $(".placeholder").append(newImg);
    $("#winsCount").text(wins);
    $("#lossesCount").text(losses);
    setTimeout(loadTrivia, 7500);
}

/// Main Program Starts HERE-----------------------------
$(document).ready(function(){
    
    var newButton = $("<button>");
    newButton.addClass("start");
    newButton.text("Begin Trivia!")
    $(".placeholder").append(newButton);
    $.ajax({
        url: "https://opentdb.com/api_token.php?command=request",
        method: "GET"
    }).then(function(response){
        loadAjax(response.token);
    });

$(".start").on("click", function(){
    $(".start").remove();
    loadTrivia();
});

$(document).on("click", ".answer", function(event){
    if(clockRunning){
        stopwatch.stop();
        if(event.target.textContent === rightOne){
            wins++;
            loadScreen("Win", event.target);
        }
        else {
            losses++;
            loadScreen("Loss", event.target);
        }
    }
});
});