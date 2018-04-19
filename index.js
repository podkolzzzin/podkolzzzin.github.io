var timerId = -1;
var currentTopic, currentIndex;
var correctCount = 0;
var answerTime = 2000;

function getCurrentQuestionCard() {
    return $($(".question-card-" + currentTopic)[currentIndex - 1]);
}

function finishCategory() {

    $("#categories-card").css({ display : "block"});
    
    var currentTopicBtn = $('#' + currentTopic + '-btn');
    setButtonState(currentTopicBtn, correctCount);
    if (correctCount >= 10)
        document.location.href = "https://tinyurl.com/y9rprqyg";
}

function setButtonState(currentTopicBtn, count) {
    
    currentTopicBtn.text(currentTopicBtn.text().replace('0', count));
    currentTopicBtn.addClass("disabled");
    currentTopicBtn.off('click');
}

function nextQuestion() {

    if (timerId != -1)
        clearInterval(timerId);

    if (currentIndex > 0)
        showCorrectAnswer();
    else
        correctCount = 0;

    currentIndex++;
    if (currentIndex > 1) 
        setTimeout(nextQuestionInternal, answerTime);
    else
        nextQuestionInternal();
}

function nextQuestionInternal() {

    var item = getCurrentQuestionCard();
    
    if (item.length == 0) {
        finishCategory();
        return;
    }
    else
        $("#categories-card").css({ display : "none"});

    item.css({display : "block"});
    var timer = item.find(".timer");

    startTimer(timer);
}

function validateAnswer(currentQuestionCard) {

    var answer = currentQuestionCard.find(".answer").text();
    var userAnswer = currentQuestionCard.find(".user-answer").val();
    answer = new RegExp(currentQuestionCard.find(".answer-pattern").text() || answer, 'gi');
    if (userAnswer.match(answer))
        return true;
    return false;
}

function showCorrectAnswer() {

    var item = getCurrentQuestionCard();
    item.css({display: "none"})

    if (validateAnswer(item)) {
        $('#answers-card').removeClass('incorrect').addClass('correct');
        correctCount++;
    }
    else
        $('#answers-card').addClass('incorrect').removeClass('correct');

    
    setCookie();

    var answer = item.find(".answer").text();
    $("#answer").text(answer);
    $('#answers-card').css({display: "block"});
    setTimeout(function() {
        $('#answers-card').css({display: "none"});
    }, answerTime);
}

function startTimer(timerElement) {
    timerId = setInterval(function() {
        var restTime = Math.round(+timerElement.text() * 10) - 1;
        if (restTime <= 0)
            nextQuestion()
        var time = (restTime / 10.0).toString();
        if (time.indexOf('.') < 0)
            time += '.0';
        timerElement.text(time);
    }, 50)
}

function getCookie() {

    
    if (window.localStorage.getItem('data'))
        return JSON.parse(window.localStorage.getItem('data'));
    else
        return {rock:0, cinema:0};
}

function setCookie() {
    
    var data = getCookie();
    data[currentTopic] = correctCount;
    window.localStorage.setItem('data', JSON.stringify(data));
}

$(document).ready(function() {
    $("#understand-btn").click(function() {
        $("#categories-card").css({display: "block"});
        $("#understand-card").css({display: "none"});
        $('.btn-next').click(function() {
            nextQuestion();
        });

        $("#rock-btn").click(function() {
            currentTopic = 'rock';
            currentIndex = 0;
            nextQuestion();
        });
        $("#cinema-btn").click(function() {
            currentTopic = 'cinema';
            currentIndex = 0;
            nextQuestion();
        });

        var cookie = window.localStorage.getItem('data');
        if (cookie) {
            var data = JSON.parse(cookie);
            if (data && data.rock)
                setButtonState( $("#rock-btn"), data.rock);
            if (data && data.cinema)
                setButtonState($("#cinema-btn"), data.cinema);
        }
    });
});