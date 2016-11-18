/**
 * --------------------------------------------------------------------
 * Islamic Quiz Created in Urdu 
 * by Hamid Karbalai - www.hamidkarbalai.com
 * Copyright (c) 2016
 * Version: 1.0	
 * --------------------------------------------------------------------
 **/
(function ($) {

    j.fn.hamid = function (settings) {

        var defaults = {
            questions: null,
            twitterStatus: 'I scored {score} on this awesome + quiz!',
            startText: 'بِسمِ اللہِ الرّحمٰانِ الرّحیم',
            endText: 'Finished!',
            splashImage: 'img/start.png',
            twitterImage: 'img/share.png',
            resultComments: {
                perfect: 'Perfect!',
                excellent: 'Excellent!',
                good: 'Good!',
                average: 'Acceptable!',
                bad: 'Disappointing!',
                poor: 'Poor!',
                worst: 'Ooop Try!'
            }

        };

        var config = j.extend(defaults, settings);
        if (config.questions === null) {
            j(this).html('<div class="intro-container slide-container"><h2 class="qTitle">Failed to parse questions.</h2></div>');
            return;
        }

        var superContainer = j(this),
            answers = [],
            introFob = '	<div class="intro-container slide-container"><div class="question-number">' + config.startText + '</div><a class="nav-start" href="#"><img src="' + config.splashImage + '" /></a></div>	',
            exitFob = '<div class="results-container slide-container"><div class="question-number">' + config.endText + '</div><div class="result-keeper"></div></div><div class="notice">Please select an option</div><div class="progress-keeper" ><div class="progress"></div></div>',
            contentFob = '';
        superContainer.addClass('main-quiz-holder');

        for (questionsIteratorIndex = 0; questionsIteratorIndex < config.questions.length; questionsIteratorIndex++) {
            contentFob += '<div class="slide-container"><div class="question-number">' + (questionsIteratorIndex + 1) + '/' + config.questions.length + '</div><div class="question">' + config.questions[questionsIteratorIndex].question + '</div><ul class="answers">';
            for (answersIteratorIndex = 0; answersIteratorIndex < config.questions[questionsIteratorIndex].answers.length; answersIteratorIndex++) {
                contentFob += '<li>' + config.questions[questionsIteratorIndex].answers[answersIteratorIndex] + '</li>';
            }

            contentFob += '</ul><div class="nav-container">';

            if (questionsIteratorIndex !== 0) {
                contentFob += '<div class="prev"><a class="nav-previous" href="#">Pre</a></div>';
            }

            if (questionsIteratorIndex < config.questions.length - 1) {
                contentFob += '<div class="next"><a class="nav-next" href="#">Next</a></div>';
            } else {
                contentFob += '<div class="next final"><a class="nav-show-result" href="#">Finished</a></div>';
            }

            contentFob += '</div></div>';
            answers.push(config.questions[questionsIteratorIndex].correctAnswer);
        }

        superContainer.html(introFob + contentFob + exitFob);

        var progress = superContainer.find('.progress'),
            progressKeeper = superContainer.find('.progress-keeper'),
            notice = superContainer.find('.notice'),
            progressWidth = progressKeeper.width(),
            userAnswers = [],
            questionLength = config.questions.length,
            slidesList = superContainer.find('.slide-container');

        function checkAnswers() {
            var resultArr = [],
                flag = false;
            for (i = 0; i < answers.length; i++) {

                if (answers[i] == userAnswers[i]) {
                    flag = true;
                } else {
                    flag = false;
                }
                resultArr.push(flag);
            }
            return resultArr;
        }

        function roundReloaded(num, dec) {
            var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
            return result;
        }

        function judgeSkills(score) {
            var returnString;
            if (score == 100) return config.resultComments.perfect;
            else if (score > 90) return config.resultComments.excellent;
            else if (score > 70) return config.resultComments.good;
            else if (score > 50) return config.resultComments.average;
            else if (score > 35) return config.resultComments.bad;
            else if (score > 20) return config.resultComments.poor;
            else return config.resultComments.worst;
        }

        progressKeeper.hide();
        notice.hide();
        slidesList.hide().first().fadeIn(500);

        superContainer.find('li').click(function () {
            var thisLi = j(this);

            if (thisLi.hasClass('selected')) {
                thisLi.removeClass('selected');
            } else {
                thisLi.parents('.answers').children('li').removeClass('selected');
                thisLi.addClass('selected');
            }
        });

        superContainer.find('.nav-start').click(function () {

            j(this).parents('.slide-container').fadeOut(500, function () {
                j(this).next().fadeIn(500);
                progressKeeper.fadeIn(500);
            });
            return false;

        });

        superContainer.find('.next').click(function () {

            if (j(this).parents('.slide-container').find('li.selected').length === 0) {
                notice.fadeIn(300);
                return false;
            }

            notice.hide();
            j(this).parents('.slide-container').fadeOut(500, function () {
                j(this).next().fadeIn(500);
            });
            progress.animate({
                width: progress.width() + Math.round(progressWidth / questionLength)
            }, 500);
            return false;
        });

        superContainer.find('.prev').click(function () {
            notice.hide();
            j(this).parents('.slide-container').fadeOut(500, function () {
                j(this).prev().fadeIn(500);
            });

            progress.animate({
                width: progress.width() - Math.round(progressWidth / questionLength)
            }, 500);
            return false;
        });

        superContainer.find('.final').click(function () {
            if (j(this).parents('.slide-container').find('li.selected').length === 0) {
                notice.fadeIn(300);
                return false;
            }

            superContainer.find('li.selected').each(function (index) {
                userAnswers.push(j(this).parents('.answers').children('li').index(j(this).parents('.answers').find('li.selected')) + 1);
            });

            progressKeeper.hide();
            var results = checkAnswers(),
                resultSet = '',
                trueCount = 0,
                shareButton = '',
                score;
            for (var i = 0, toLoopTill = results.length; i < toLoopTill; i++) {
                if (results[i] === true) {
                    trueCount++;
                    isCorrect = true;
                }
                resultSet += '<div class="result-row"> Question #' + (i + 1) + (results[i] === true ? "<div class='correct'><span>Correct</span></div>" : "<div class='wrong'><span>Incorrect</span></div>");
                resultSet += '<div class="resultsview-qhover">' + config.questions[i].question;
                resultSet += "<ul>";
                for (answersIteratorIndex = 0; answersIteratorIndex < config.questions[i].answers.length; answersIteratorIndex++) {
                    var classestoAdd = '';
                    if (config.questions[i].correctAnswer == answersIteratorIndex + 1) {
                        classestoAdd += 'right';
                    }
                    if (userAnswers[i] == answersIteratorIndex + 1) {
                        classestoAdd += ' selected';
                    }
                    resultSet += '<li class="' + classestoAdd + '">' + config.questions[i].answers[answersIteratorIndex] + '</li>';
                }
                resultSet += '</ul></div></div>';

            }
            score = roundReloaded(trueCount / questionLength * 100, 2);
            shareButton = '<a href="http://twitter.com/share?text=' + config.twitterStatus.replace("{score}", score) + '&via=HamidKarbalai" class="share-button"><img src="' + config.twitterImage + '" /></a>';


            resultSet = '<h2 class="qTitle">' + judgeSkills(score) + ' آپکا سکور ' + score + '%</h2>' + shareButton + resultSet + '<div class="hamid-clear"></div>';
            superContainer.find('.result-keeper').html(resultSet).show(500);
            superContainer.find('.resultsview-qhover').hide();
            superContainer.find('.result-row').hover(function () {
                j(this).find('.resultsview-qhover').show();
            }, function () {
                j(this).find('.resultsview-qhover').hide();
            });
            j(this).parents('.slide-container').fadeOut(500, function () {
                j(this).next().fadeIn(500);
            });
            return false;
        });
    };
})(jQuery);