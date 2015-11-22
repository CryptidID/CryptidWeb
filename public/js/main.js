$(document).on('change', 'input', function() {
    $(this).removeClass("error");
});

$(function() {
    $('#hero-form-submit').click(function() {
        $('#id-form input[name="dac"]').val($('#hero-form input[name="fn"]').val());
        $('#id-form input[name="dcs"]').val($('#hero-form input[name="ln"]').val());
        $('html, body').animate({
            scrollTop: $("#demo").offset().top
        }, 1500);
    });

    $('#verify-submit').click(function() {
        var bol = 0;
        if ($('#chainIDBase64').val().length <= 0) {
            $('#verify-id-form input[type="password"]').removeClass("error");
            $('#chainIDBase64').toggleClass("error");
            bol++;
        } else {
            $('#chainIDBase64').removeClass("error");
        }
        if ($('#verify-id-form input[type="password"]').val().length <= 0) {
            $('#verify-id-form input[type="password"]').removeClass("error");
            $('#verify-id-form input[type="password"]').toggleClass("error");
            bol++;
        } else {
            $('#verify-id-form input[type="password"]').removeClass("error");
        }
        if (bol == 0) {
            $(".processing-verify").show();  
            $.getJSON("http://localhost:8080/api/candidate/GetCandidateFromChain/" + $('#chainIDBase64').val() + "/" + $('#verify-id-form input[type="password"]').val() + "/", function(data) {
                if (data.Error == undefined) {
                    $('.verify-errors').html("<div class='alert alert-success' width='320' height='240'><strong>Success</strong> ID has been retrieved and shown below</div>");
                    $('.verify-body div[name="dcs"]').html(data.Dcs);
                    $('.verify-body div[name="dac"]').html(data.Dac + ",");
                    $('.verify-body div[name="dad"]').html(data.Dad);
                    if (data.Dbc == 1) {
                        $('.verify-body div[name="dbc"]').html("M");
                    } else {
                        $('.verify-body div[name="dbc"]').html("F");
                    }

                    switch (data.Day) {
                        case 1:
                          $('.verify-body div[name="day"]').html("BLK");
                          break;
                        case 2:
                          $('.verify-body div[name="day"]').html("BLU");
                          break;
                        case 3:
                          $('.verify-body div[name="day"]').html("GRY");
                          break;
                        case 4:
                          $('.verify-body div[name="day"]').html("GRN");
                          break;
                        case 5:
                          $('.verify-body div[name="day"]').html("HAZ");
                          break;
                        case 6:
                          $('.verify-body div[name="day"]').html("MAR");
                          break;
                        case 7:
                          $('.verify-body div[name="day"]').html("PNK");
                          break;
                        case 8:
                          $('.verify-body div[name="day"]').html("DIC");
                          break;
                        case 9:
                          $('.verify-body div[name="day"]').html("UNK");
                          break;
                    }

                    $('.verify-body div[name="dau"]').html(data.Dau.AnsiFormat);
                    str = data.Dbb.split("T");
                    var date = str[0].split("-");
                    $('.verify-body div[name="dbb"]').html(date[1] + "/" + date[2] + "/" + date[0]);
                    $('.verify-body div[name="dag"]').html(data.Dag);
                    $('.verify-body span[name="dai"]').html(data.Dai);
                    $('.verify-body span[name="daj"]').html(data.Daj + ",");
                    $('.verify-body span[name="dak"]').html(parseInt(data.Dak.AnsiFormat)/10000);
                    $('.verify-body .verify-image').attr("src", "data:image/bmp;base64," +data.Image);
                    $('#camera-container-all .alert').fadeOut(100);
                    $('.verify-result').fadeIn(100);
                } else {
                    $('.verify-result').fadeOut(100);
                    if((data.Error).indexOf("Padding is invalid") > 0){
                      $('.verify-errors').html("<div class='alert alert-error' width='320' height='240'><strong>Error Occured:</strong>There has been an error with the information provided, please ensure your password ad ChainID is correct</div>");
                    } else if((data.Error).indexOf("valid Base-64 string") > 0){
                      $('.verify-errors').html("<div class='alert alert-error' width='320' height='240'><strong>Error Occured:</strong>There has been an error with the ID number, please enter a valid ID number</div>");

                    } else {
                      $('.verify-errors').html("<div class='alert alert-error' width='320' height='240'><strong>Error Occured:</strong>" + data.Error + "</div>");
                    }
                    // alert("API ERROR OCCURED: \n\n" + data.Error + " \n\n" + "P.S. THIS ALERT SHOULD BE REPLACED");
                }
            })
            .always(function() {
              $(".processing-verify").hide();
            })
            .fail(function() {
              $('.verify-errors').html("<div class='alert alert-error' width='320' height='240'><strong>Error Occured:</strong>There seems to be a problem on our end, please let us know so we can fix it immediately.</div>");
            });
        }
    });
});
