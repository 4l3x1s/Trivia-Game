$(document).ready(function () {

  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click', '.option', trivia.guessChecker);

})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId: '',
  // questions options and answers data
  questions: {
    q1: 'In S1E1 "Pilot": Who started their first day at Dunder Mifflin Scranton?',
    q2: 'In S1E2 "Diversity Day": What famous comedian s stand up routine does Michael imitate?',
    q3: 'In S1E3 "Health Care": Which of these is NOT one of Jim and Pam s made up diseases?',
    q4: 'In S1E4 "The Alliance": How much money does Michael donate to Oscar s nephew s charity, not realizing it is a walk-a-thon and the amount is per mile?',
    q5: 'In S1E5 Basketball, What small appliance of Pam s breaks down? (It was given to her at her engagement party three years earlier)',
    q6: 'In S1E6 "Hot Girl" What is the Hot Girl s name?',
    q7: 'In S2E1 "The Dundies": What Dundie award does Phyllis take home?'
  },
  options: {
    q1: ['Jim Halpert', 'Ryan Howard', 'Michael Scott', 'Erin Hannon'],
    q2: ['Chris Rock', 'Richard Pryor', 'Robin Williams', 'George Carlin'],
    q3: ['Killer nanorobots', 'Hot dog fingers', 'Spontaneous dental hydroplosion ', 'Hair cancer'],
    q4: ['40', '10', '25', '100'],
    q5: ['Toaster', 'Microwave', 'Blender', 'Toaster oven'],
    q6: ['JAmy', 'Christy', 'Kelly', 'Katy'],
    q7: ['The Busiest Beaver Dundie', 'The Bushiest Beaver Dundie', ' Spicy Curry Dundie', 'Whitest Sneakers Dundie']
  },
  answers: {
    q1: 'Ryan Howard',
    q2: 'Chris Rock',
    q3: 'Hair cancer',
    q4: '25',
    q5: 'Toaster oven',
    q6: 'Katy',
    q7: 'The Bushiest Beaver Dundie'
  },
  // trivia methods
  // method to initialize game
  startGame: function () {
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);

    // show game section
    $('#game').show();

    //  empty last results
    $('#results').html('');

    // show timer
    $('#timer').text(trivia.timer);

    // remove start button
    $('#start').hide();

    $('#remaining-time').show();

    // ask first question
    trivia.nextQuestion();

  },
  // method to loop through and display questions and options 
  nextQuestion: function () {

    // set timer to 20 seconds each question
    trivia.timer = 10;
    $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);

    // to prevent timer speed up
    if (!trivia.timerOn) {
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }

    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);

    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];

    // creates all the trivia guess options in the html
    $.each(questionOptions, function (index, key) {
      $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
    })

  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning: function () {
    // if timer still has time left and there are still questions left to ask
    if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
      $('#timer').text(trivia.timer);
      trivia.timer--;
      if (trivia.timer === 4) {
        $('#timer').addClass('last-seconds');
      }
    }
    // the time has run out and increment unanswered, run result
    else if (trivia.timer === -1) {
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if (trivia.currentSet === Object.keys(trivia.questions).length) {

      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Thank you for playing!</h3>' +
          '<p>Correct: ' + trivia.correct + '</p>' +
          '<p>Incorrect: ' + trivia.incorrect + '</p>' +
          '<p>Unaswered: ' + trivia.unanswered + '</p>' +
          '<p>Please play again!</p>');

      // hide game sction
      $('#game').hide();

      // show start button to begin a new game
      $('#start').show();
    }

  },
  // method to evaluate the option clicked
  guessChecker: function () {

    // timer ID for gameResult setTimeout
    var resultId;

    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

    // if the text of the option picked matches the answer of the current question, increment correct
    if ($(this).text() === currentAnswer) {
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');

      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else {
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');

      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>NOPE! ' + currentAnswer + '</h3>');
    }

  },
  // method to remove previous question results and options
  guessResult: function () {

    // increment to next question set
    trivia.currentSet++;

    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();

    // begin next question
    trivia.nextQuestion();

  }

}