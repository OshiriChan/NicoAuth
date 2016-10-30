$(function(){
  if (localStorage.flag == 1) {
    $("#watch_message_box").append('<h class="button" id="authbutton" href="#">枠移動 ON</h>');
  } else {
    $("#watch_message_box").append('<h class="button" id="authbutton" href="#">枠移動 OFF</h>');
  }

  var firstflag = true, authflag = true;
  var community = "";
  var url = "";
  var failcnt = 0;
  setInterval(function(){
    if (localStorage.flag == 0) {
      console.log("stop auth");
      return;
    }
    var streamurl = location.href;
    if (streamurl.indexOf("http://live.nicovideo.jp/watch/") != -1 && failcnt <= 50) {
      console.log(failcnt);
      streamurl = streamurl.split('?')[0].split('/');
      streamurl = streamurl[streamurl.length-1];
      $.ajax({
        url: "http://live.nicovideo.jp/api/getplayerstatus?v="+streamurl,
        type: "GET",
        dataType: "xml",
        cache : false,
        success: function (res) {
          if ($(res)[0].childNodes[0].attributes[0].nodeValue == "fail" || firstflag == true) {
            if (firstflag == true) {
              community = $(res).find("default_community").text();
              url = "http://com.nicovideo.jp/community/"+community;
              firstflag = false;
            }
            console.log("community: "+community);
            var END_POINT = 'http://query.yahooapis.com/v1/public/yql';
            var xpath = "//a[@class='now_live_inner']"
            console.log(url);
            $.ajax( {
              type: "GET",
              url: url,
              dataType: "html",
              success: function (res) {
                var nowurl, nexturl, nowlv, nextlv;
                try {
                  nowurl = location.href.split("?")[0];
                  nexturl = $(res).find(".now_live_inner")[0].href.split("?")[0];
                  nowlv = nowurl.split("lv")[1];
                  nextlv = nexturl.split("lv")[1];

                } catch (e) {
                  console.log("not stream");
                }
                if (nowurl == nexturl || nexturl == undefined) {
                  console.log("this stream is latest");
                } else if(parseInt(nowlv) < parseInt(nextlv)) {
                  window.location.href = nexturl;
                }
                //console.log("now  : "+nowurl);
                //console.log("next : "+nexturl);
                failcnt++;
              },
              error: function () {
                console.log("error");
              }
            });
          }
        }
      });
    }
  },5000);

  $("#authbutton").click( function () {
    if (localStorage.flag == 1) {
      $("#authbutton").html("枠移動 OFF");
      localStorage.flag = 0;
    } else {
      $("#authbutton").html("枠移動 ON");
      localStorage.flag = 1;
    }

  });
});
