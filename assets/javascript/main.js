$(document).foundation()

getTrending();

createSearchListener();
//getFirstReview('Frozen');



var apiKeyMC = "480bfb040aaa88e722eb4a15ee9efd15"
var baseURL = "http://api.meaningcloud.com/"
var summaryURL = "summarization-1.0/"
var sentimentURL = "sentiment-2.1"
var queryURL = "";
var queryText = ""
var numSentences = 1;

var gettysBurg = "Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this. But, in a larger sense, we can not dedicate -- we can not consecrate -- we can not hallow -- this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us -- that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion -- that we here highly resolve that these dead shall not have died in vain -- that this nation, under God, shall have a new birth of freedom -- and that government of the people, by the people, for the people, shall not perish from the earth."

var ajaxOptions = {
    url: queryURL,
    method: "GET",
    crossDomain: true,

    beforeSend: function(xhrObj){
        // Request headers
        xhrObj.setRequestHeader("Content-Type","application/json");
        xhrObj.setRequestHeader("Accept","JSON");
    }
}

queryText = "this is great"
// queryText = gettysBurg;

// isURL = true;
// getSummary(queryText, isURL);
// getSentiment(queryText, isURL);


function getSummary(text){

    return $.post(baseURL + summaryURL + "?key=" + apiKeyMC + "&txt=" + text + "&sentences=" + numSentences,{ 

    }).then(function (response) { 
        console.log(response)
        console.log(response.summary)
        $("#movie-info").append(response.summary)
        return response;
    })
}

function getSentiment (text){
// Sentiment response object:
// agreement: "AGREEMENT"
// confidence: "100"
// irony: "NONIRONIC"
// model: "general_en"
// score_tag: "P+"
// sentence_list: [{…}]
// sentimented_concept_list: []
// sentimented_entity_list: []
// status: {code: "0", msg: "OK", credits: "1", remaining_credits: "19898"}
// subjectivity: "OBJECTIVE"

//  EVIDENTLY ONLY WORKS ON SINGLE SENTENCES?

    return $.post(baseURL + sentimentURL + "?key=" + apiKeyMC + "&txt=" + text + "&lang=en",{ 

    }).then(function (response) { 
        console.log(response)
        console.log(response.sentiment)
        console.log("agreement: " + response.agreement)
        console.log("irony: " + response.irony)
        console.log("subjectivity: " + response.subjectivity)
        console.log("confidence: " + response.confidence)

        return response;
    })
}


function combineReviewsText( reviewsRaw ){
    var combined = '';
    for( var i = 0; i < reviewsRaw.length; i++){
        combined += reviewsRaw[i].content;
    }
    return combined;
}

function getFirstReview( movieName ){
    var urlBase = 'https://api.themoviedb.org/3/search/movie?';
    var apiKeyPD = 'api_key=7c49e1342952d7c7e126e900862f9e64';
    var movieSearch = urlBase + apiKeyPD + '&query=' + movieName
    $.ajax({
        url: movieSearch,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        var firstRes = response.results[0];

        var reviewSearch = "https://api.themoviedb.org/3/movie/" + firstRes.id + "/reviews?"
        reviewSearch += apiKeyPD;
        $.ajax({
            url: reviewSearch,
            method: "GET"
        }).then(function (response) {
            // console.log(response)
            var reviewsRaw = response.results;

            var combined = combineReviewsText( reviewsRaw );

            var sentiment = getParallelDotsSentiment( combined );

            var movieDiv = createMovieDiv(firstRes);
            $('#movie-title').append(movieDiv)

            // console.log(combined); //will go into sentiment api
            getSummary(combined);

        })
    })
}
//https://api-us.faceplusplus.com/facepp/v3/detect?api_key=8dOqvd6QOBI7Uy45Sp5I2cSmlYZQva13

function combineReviewsText( reviewsRaw ){
    var combined = '';
    for( var i =0; i < reviewsRaw.length; i++){
        combined += reviewsRaw[i].content;
    }
    return combined;
}

function getFirstReview( movieName ){
    var urlBase = 'https://api.themoviedb.org/3/search/movie?';
    var apiKeyPD = 'api_key=7c49e1342952d7c7e126e900862f9e64';
    var movieSearch = urlBase + apiKeyPD + '&query=' + movieName
    $.ajax({
        url: movieSearch,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        var firstRes = response.results[0];

        var reviewSearch = "https://api.themoviedb.org/3/movie/" + firstRes.id + "/reviews?"
        reviewSearch += apiKeyPD;
        $.ajax({
            url: reviewSearch,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            var reviewsRaw = response.results;

            var combined = combineReviewsText( reviewsRaw );

            var sentiment = getParallelDotsSentiment( combined )

            var movieDiv = createMovieDiv(firstRes, sentiment);
            $('#movie-holder').append(movieDiv)

            console.log(combined) //will go into sentiment api
        })
    })
}

//getFirstReview( 'Frozen' );

function getTrending(){
    var apiKeyPD = 'api_key=7c49e1342952d7c7e126e900862f9e64';
    var requestUrl = 'https://api.themoviedb.org/3/movie/popular?'+ apiKeyPD +'&language=en-US&page=1';

    $.ajax({
        url: requestUrl,
        method: "GET"
    }).then(function (response) {
        var results = response.results;
        console.log( results );

        for(var i =0; i < 4; i++){
            var movieDiv = createTrendingDiv( results[i] )
            $('#trending').append( movieDiv )
        }

    })

}

function createSearchListener(){
    var $searchButton = $('#search-button');
    var $searchText = $('#search-text');
    $searchButton.on('click', function(e){
        e.preventDefault();
        var searchedText = $searchText.val();
        console.log('searched:', searchedText);

        getFirstReview(searchedText);

        $searchText.val('');
    })
}

function getParallelDotsSentiment( text ){
    return $.post("https://apis.paralleldots.com/v4/sentiment",{ 
        api_key: "nNrvGbJRqlR7VMkESMFaKRm6Rh5gnsmhYtf6N3trZzI", 
        text: text 
    }).then(function (response) { 
        console.log(response)
        return response;
    })
}

function getParallelDotsSentiment( text ){
    return $.post("https://apis.paralleldots.com/v4/sentiment",{ 
        api_key: "nNrvGbJRqlR7VMkESMFaKRm6Rh5gnsmhYtf6N3trZzI", 
        text: text 
    }).then(function (response) { 
        console.log(response)

        var sent = response.sentiment;

        var neg = sent.negative;
        var neu = sent.neutral;
        var pos = sent.positive;

        var sentimentResult = "" 

        // Assess general sentiment:
        if (pos > neu && pos > neg) {
            sentimentResult = "Somewhat Positive"
            console.log("somewhat positive")
            if (pos > 0.5) {
                sentimentResult = "Positive"
                console.log("positive")
                if (pos > 0.7) {
                    sentimentResult = "Very Positive"
                    console.log("very positive")
                }
            }
		}
		else if (neu > pos && neu > neg) {
            sentimentResult = "Somewhat Neutral"
            console.log("somewhat neutral")
            if (pos > 0.5) {
                sentimentResult = "Neutral"
                console.log("neutral")
                if (pos > 0.7) {
                    sentimentResult = "Very Neutral"
                    console.log("very neutral")
                }
            }
		}
		else if (neg > pos && neg > neu) {
            sentimentResult = "Somewhat Negative"
            console.log("somewhat negative")
            if (pos > 0.5) {
                sentimentResult = "Negative"
                console.log("negative")
                if (pos > 0.7) {
                    sentimentResult = "Very Negative"
                    console.log("very negative")
                }
            }
		}

        $("#movie-info").append("<br><br>General Sentiment: " + sentimentResult); 
        return response;
    })
}

function createMovieDiv (movieResponse, sentiment){
    var poster = 'https://image.tmdb.org/t/p/w500'+ movieResponse.poster_path;
    var title = movieResponse.title;
    var popularity = movieResponse.popularity;
    var releaseDate = movieResponse.release_date;
    var overview = movieResponse.overview;
    var genres = movieResponse.genre_ids;
    var id = movieResponse.id;

    var movieDiv = $('<div>');
    movieDiv.append( $('<img>', {src: poster, alt: title}) )
    if( sentiment !== undefined ){
        movieDiv.append($('<p>').text(sentiment))
    }

    return movieDiv;
}

function createTrendingDiv(movieResponse, sentiment) {
    var poster = 'https://image.tmdb.org/t/p/w500' + movieResponse.poster_path;
    var title = movieResponse.title;
    var popularity = movieResponse.popularity;
    var releaseDate = movieResponse.release_date;
    var overview = movieResponse.overview;
    var genres = movieResponse.genre_ids;
    var id = movieResponse.id;

    var movieDiv = $('<div>', { class: "cell large-3 small-6 one" });
    movieDiv.append(
        $('<div>', { class: "grid-x" }).append( 
              $('<div>', {class: 'cell shad'}).append(
                  $('<img>', {src: poster, alt: title})
              )
            )
    )
    var displayText = overview;
    if (sentiment !== undefined){
        displayText = sentiment;
    }
    movieDiv.append(
        $('<div>', { class: "grid-x" }).append(
            $('<div>', { class: 'cell text' }).text(
                displayText
            )
        )
    )

    return movieDiv;
}