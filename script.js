(function () {
    $("#more").hide();
    var results = $("#results-container");
    var nextUrl;

    $("#submit").on("click", function () {
        $("#results-container").empty();
        var userInput = $("input[name=user-input]").val();
        var dropdownSelectVal = $("select").val();
        var baseUrl = "https://elegant-croissant.glitch.me/spotify";

        $.ajax({
            url: baseUrl,
            method: "GET",
            data: {
                query: userInput,
                type: dropdownSelectVal,
            },
            success: function (response) {
                response = response.albums || response.artists;
                results.html(getResultsHtml(response.items));
                if (response.items.length < 1) {
                    $("#searchresults").html("<h2>NO RESULTS</h2>");
                } else {
                    $("#searchresults").html(
                        "<h2> Search results for " + userInput + "</h2>"
                    );
                }

                setNextUrl(response);

                if (response.items.length >= 20) {
                    infinityScroll();
                    $("#more").show();
                }
            },
        });
    });

    $("#more").on("click", function () {
        getMoreResults();
    });

    function getMoreResults() {
        $.ajax({
            url: nextUrl,
            success: function (response) {
                response = response.artists || response.albums;
                results.append(getResultsHtml(response.items));
                setNextUrl(response);
                if (response.items.length < 1) {
                    $("#more").hide();
                }
                infinityScroll();
            },
        });
    }

    function setNextUrl(response) {
        nextUrl =
            response.next &&
            response.next.replace(
                "api.spotify.com/v1/search",
                "elegant-croissant.glitch.me/spotify"
            );
    }

    function getResultsHtml(items) {
        var myHtml = "";
        var imgUrl = "/default.jpg";
        for (var i = 0; i < items.length; i++) {
            if (items[i].images[0]) {
                imgUrl = items[i].images[0].url;
            }
            myHtml +=
                "<div><h3><a href='" +
                items[i].external_urls.spotify +
                "'>" +
                items[i].name +
                "</a></h3><a href='" +
                items[i].external_urls.spotify +
                "'><img src='" +
                imgUrl +
                "'></a></div>";
        }
        $("#results-container").append(myHtml);
    }

    function infinityScroll() {
        var hasReachedEnd = $(document).scrollTop() + $(window).height();
        console.log("hasreachedend:", hasReachedEnd);
        if (hasReachedEnd >= $(document).height() - 50) {
            getMoreResults();
        } else {
            setTimeout(infinityScroll, 500);
        }
    }
})();
