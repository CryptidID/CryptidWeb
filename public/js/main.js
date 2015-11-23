jQuery["postJSON"] = function( url, data, callback ) {
    // shift arguments if data argument was omitted
    if ( jQuery.isFunction( data ) ) {
        callback = data;
        data = undefined;
    }

    return jQuery.ajax({
        url: url,
        type: "POST",
        contentType:"application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: callback
    });
};

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
        var message = "";
        var bol = 0;
        if ($('#chainIDBase64').val().length <= 0) {
            $('#chainIDBase64').removeClass("error");
            $('#chainIDBase64').toggleClass("error");
            message = " The ID number cannot be empty"
            bol += 1;
        } else {
            $('#chainIDBase64').removeClass("error");
        }
        if ($('#chainIDBase64').val().length < 44 && $('#chainIDBase64').val().length > 0) {
          // $('#camera-container-all').html("<div class='alert alert-error'><strong>Error: </strong>Invalid ID code</div>");
          message = " Invalid ID number, needs to be 44 characters long";
          bol += 3;
        }
        if ($('#verify-id-form input[type="password"]').val().length <= 0) {
            $('#verify-id-form input[type="password"]').removeClass("error");
            $('#verify-id-form input[type="password"]').toggleClass("error");
            if(message != ""){
              message += " and t"
            } else {
              message += " T"
            }
            message += "he password cannot be empty"
            bol += 5;
        } else {
            $('#verify-id-form input[type="password"]').removeClass("error");
        }
        if (bol == 0) {
            $(".processing-verify").show();
            $.postJSON("http://cryptid.xyz:8080/CandidateDelegate/GetCandidateFromChain/", JSON.stringify({ChainIdBase64: $('#chainIDBase64').val(), Password: $('#verify-id-form input[type="password"]').val()}), function(data) {

                if (data.Error == undefined) {
                    $('.verify-errors').html("<div class='alert alert-success' width='320' height='240'><strong>Success</strong> ID has been retrieved and shown below</div>");
                    $('.verify-body div[name="dcs"]').html(data.Dcs);
                    $('.verify-body div[name="dac"]').html(data.Dac + (data.Dad != "" ? "," : ""));
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
                    $('.verify-body .verify-image').attr("src", "data:image/jpg;base64," +data.ImageString);
                    $('#camera-container-all .alert').fadeOut(100);
                    $('.verify-result').fadeIn(100);
                } else {
                    $('.verify-result').fadeOut(100);
                    if(data.ErrorMessage.indexOf("PasswordIncorrectException") >= 0) {
                      $('.verify-errors').html("<div class='alert alert-error' width='320' height='240'><strong>Error Occured:</strong>There has been an error with the information provided, please ensure your password ad ChainID is correct</div>");
                    } else if(data.Error.indexOf("valid Base-64 string") >= 0) {
                      $('.verify-errors').html("<div class='alert alert-error' width='320' height='240'><strong>Error Occured:</strong>There has been an error with the ID number, please enter a valid ID number</div>");
                    } else if(data.ErrorMessage.indexOf("FactomChainException") >= 0) {
                      $('.verify-errors').html("<div class='alert alert-error' width='320' height='240'><strong>Error Occured:</strong>The chain was not found</div>");

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
        } else {
           $('#camera-container-all').html("<div class='alert alert-error'><strong>Error: </strong>" + message + "</div>");
        }
    });
});
