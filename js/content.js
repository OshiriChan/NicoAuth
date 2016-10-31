$(function(){

  if (localStorage.flag == undefined) { localStorage.flag = 1; }
  if (localStorage.flag == 1) {
    $("#watch_message_box").append('<h class="button" id="authbutton" href="#">枠移動 ON</h>');
  } else {
    $("#watch_message_box").append('<h class="button" id="authbutton" href="#">枠移動 OFF</h>');
  }
  if ($("#watch_title_box").offset() != undefined) {$(window).scrollTop($("#watch_title_box").offset().top);}
  var firstflag = true, authflag = true;
  var community = "";
  setInterval(function(){
    if (localStorage.flag == 0) {
      console.log("stop auth");
      return;
    }
    var streamurl = location.href;
    if (streamurl.indexOf("http://live.nicovideo.jp/watch/") != -1) {
      if (firstflag == true) { firstflag = false; }
      if ($(".meta").find("a")[0] == undefined) {
        community = $($(".text")[0].childNodes).find("a")[0].href;
        streamurl = $($(".text")[0].childNodes).find("a")[0].href.split("community/")[1];
      } else {
        community = $(".meta").find("a")[0].href;
        streamurl = $(".meta").find("a")[0].href.split("community/")[1];
      }
      //console.log("st  "+streamurl);
      //console.log("co  "+community);
      $.ajax({
        url: "http://live.nicovideo.jp/api/getplayerstatus?v="+streamurl,
        type: "GET",
        dataType: "xml",
        cache : false,
        success: function (res) {
          if ($(res)[0].childNodes[0].attributes[0].nodeValue == "fail") {
            console.log("end stream");
            return;
          }
          var live_status = $(res).find("archive")[0].childNodes[0].nodeValue; // 0:stream, 1:timeshift
          var nowurl = location.href.split("?")[0]; var nowlv = nowurl.split("lv")[1];
          var nexturl = nowurl.split("lv")[0], nextlv = "";
          if ($(res).find("archive")[0].childNodes[0].nodeValue == '0') {
            nexturl += $(res).find("id")[0].childNodes[0].nodeValue;
            nextlv = $(res).find("id")[0].childNodes[0].nodeValue.split("lv")[1];
          }

          // console.log("now  : "+nowurl);
          // console.log("next : "+nexturl);
          // console.log("nowlv  : "+nowlv);
          // console.log("nextlv : "+nextlv);

          if (nowurl == nexturl || nextlv == "") {
            console.log("this stream is latest");
          } else if(parseInt(nowlv) < parseInt(nextlv)) {
            window.location.href = nexturl;
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
