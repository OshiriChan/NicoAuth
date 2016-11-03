$(function(){
  var windowHeight = $(window).height();
  if (localStorage.streamflag == "1") {
    $("#checkflg").html("アラートON");
  } else {
    $("#checkflg").html("アラートOFF");
  }
  $("body").css("height", windowHeight);

  function onGotText(badgeText) {
    if (localStorage.streamflag == "0" ){
      chrome.browserAction.setBadgeText({text:String("0")});
      $("#live_num").html("0");
    } else {
      $("#live_num").html(badgeText);
    }
  }
  chrome.browserAction.getBadgeText({}, onGotText);



  chrome.runtime.sendMessage({greeting: "first"}, function(response) {
    if (response.res == "non") {
      $("#num").html("コミュニティ情報取得");
    } else {
      $("#mail").attr("value", response.mail);
      $("#password").attr("value", response.password);
    }
  });
  $("#num").click(function () {
    var data = {
      mail: $("#mail").val(),
      password: $("#password").val(),
      save: $("#saveinfo:checked").val()
    }
    chrome.runtime.sendMessage(data, function(response) {
      console.log("send info");
    });
  });

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var activated_tab = e.target // activated tab
    $("#stream").empty();
    $("#stream").append('<br/><br/>');
    if ($(activated_tab).attr("id") == "live" && localStorage.streamflag == "1") {
      chrome.runtime.sendMessage({comget:"y"}, function(response) {
        //console.log(response.length);
        for (var i = 0; i < response.com.length; i++) {
          $("#stream").append('<a id="link" target="_blank" href="http://live.nicovideo.jp/watch/'+response.com[i]+'?ref=community">'+response.name[i]+'の生放送</a><br/>');
        }
      });
    }
  });

  $("#checkflg").click( function () {
    //console.log(localStorage.streamflag);
    if (localStorage.streamflag == "0") {
      $("#checkflg").html("アラートON");
      localStorage.streamflag = "1";
    } else {
      $("#checkflg").html("アラートOFF");
      localStorage.streamflag = "0";
    }
    chrome.runtime.sendMessage({streamflag: localStorage.streamflag});
  });
});
