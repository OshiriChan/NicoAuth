$(function(){
  var streamurl = location.href;
  if (localStorage.flag == undefined) { localStorage.flag = 1; }
  if (localStorage.scrollflag == undefined) { localStorage.scrollflag = 1; }
  if (localStorage.flag == 1) {
    if (streamurl.indexOf("http://live.nicovideo.jp/watch/") != -1) {
      $("#watch_message_box").append('<span class="button" id="authbutton" >枠移動 ON</span>&nbsp;&nbsp;&nbsp;');
    } else if (streamurl.indexOf("http://live2.nicovideo.jp/watch/") != -1) {
      $("#bourbon-block").append('<span class="button" id="authbutton" >枠移動 ON</span>&nbsp;&nbsp;&nbsp;');
    }
  } else {
    if (streamurl.indexOf("http://live.nicovideo.jp/watch/") != -1) {
      $("#watch_message_box").append('<span class="button" id="authbutton" >枠移動 OFF</span>&nbsp;&nbsp;&nbsp;');
    } else if (streamurl.indexOf("http://live2.nicovideo.jp/watch/") != -1) {
      $("#bourbon-block").append('<span class="button" id="authbutton" >枠移動 OFF</span>&nbsp;&nbsp;&nbsp;');
    }
  }
  if (localStorage.scrollflag == 1) {
    if (streamurl.indexOf("http://live.nicovideo.jp/watch/") != -1) {
      $("#watch_message_box").append('<span class="button" id="scrollbutton" >自動スクロール ON</span>');
    } else if (streamurl.indexOf("http://live2.nicovideo.jp/watch/") != -1) {
      $("#bourbon-block").append('<span class="button" id="scrollbutton" >自動スクロール ON</span>');
    }
  } else {
    if (streamurl.indexOf("http://live.nicovideo.jp/watch/") != -1) {
      $("#watch_message_box").append('<span class="button" id="scrollbutton" >自動スクロール OFF</span>');
    } else if (streamurl.indexOf("http://live2.nicovideo.jp/watch/") != -1) {
      $("#bourbon-block").append('<span class="button" id="scrollbutton" >自動スクロール OFF</span>');
    }
  }
  if ($("#watch_title_box").offset() != undefined && localStorage.scrollflag == "1") {$(window).scrollTop($("#watch_title_box").offset().top);}
  var firstflag = true, authflag = true;
  var community = "";
  setInterval(function(){
    streamurl = location.href;
    if (localStorage.flag == 0) {
      //console.log("stop auth");
      return;
    }
    if (streamurl.indexOf("http://live.nicovideo.jp/watch/") != -1) {
      if ($(".meta").find("a")[0] == undefined) {
        community = $($(".text")[0].childNodes).find("a")[0].href;
        streamurl = $($(".text")[0].childNodes).find("a")[0].href.split("community/")[1];
      } else {
        community = $(".meta").find("a")[0].href;
        streamurl = $(".meta").find("a")[0].href.split("community/")[1];
      }
      $.ajax({
        url: "http://live.nicovideo.jp/api/getplayerstatus?v="+streamurl,
        type: "GET",
        dataType: "xml",
        cache : false,
        success: function (res) {
          if ($(res)[0].childNodes[0].attributes[0].nodeValue == "fail") {
            //console.log("end stream");
            return;
          }
          var live_status = $(res).find("archive")[0].childNodes[0].nodeValue; // 0:stream, 1:timeshift
          var nowurl = location.href.split("?")[0]; var nowlv = nowurl.split("lv")[1];
          var nexturl = nowurl.split("lv")[0], nextlv = "";
          if ($(res).find("archive")[0].childNodes[0].nodeValue == '0') {
            nexturl += $(res).find("id")[0].childNodes[0].nodeValue;
            nextlv = $(res).find("id")[0].childNodes[0].nodeValue.split("lv")[1];
          }
          if (nowurl == nexturl || nextlv == "") {
            //console.log("this stream is latest");
          } else if(parseInt(nowlv) < parseInt(nextlv)) {
            window.location.href = nexturl;
          }
        }
      });
    } else if (streamurl.indexOf("http://live2.nicovideo.jp/watch/") != -1) {
      //console.log("sinhaisin");
      //console.log($(".program-community").find("a")[0]);
      if ($(".program-community").find("a")[0] == undefined) {
        community = $($(".text")[0].childNodes).find("a")[0].href;
        streamurl = $($(".text")[0].childNodes).find("a")[0].href.split("community/")[1];
      } else {
        community = $(".program-community").find("a")[0].href;
        streamurl = $(".program-community").find("a")[0].href.split("community/")[1];
      }
      $.ajax({
        url: "http://live.nicovideo.jp/api/getplayerstatus?v="+streamurl,
        type: "GET",
        dataType: "xml",
        cache : false,
        success: function (res) {
          if ($(res)[0].childNodes[0].attributes[0].nodeValue == "fail") {
            //console.log("end stream");
            return;
          }
          var live_status = $(res).find("archive")[0].childNodes[0].nodeValue; // 0:stream, 1:timeshift
          var nowurl = location.href.split("?")[0]; var nowlv = nowurl.split("lv")[1];
          var nexturl = nowurl.split("lv")[0], nextlv = "";
          if ($(res).find("archive")[0].childNodes[0].nodeValue == '0') {
            nexturl += $(res).find("id")[0].childNodes[0].nodeValue;
            nextlv = $(res).find("id")[0].childNodes[0].nodeValue.split("lv")[1];
          }
          if (nowurl == nexturl || nextlv == "") {
            //console.log("this stream is latest");
          } else if(parseInt(nowlv) < parseInt(nextlv)) {
            window.location.href = nexturl;
          }
        }
      });
    } else if (streamurl.indexOf(".nicovideo.jp/gate/") != -1) {
      //console.log("sinhaisin");
      //console.log($(".program-community").find("a")[0]);
      if ($(".program-community").find("a")[0] == undefined) {
        community = $($(".text")[0].childNodes).find("a")[0].href;
        streamurl = $($(".text")[0].childNodes).find("a")[0].href.split("community/")[1];
      } else {
        community = $(".program-community").find("a")[0].href;
        streamurl = $(".program-community").find("a")[0].href.split("community/")[1];
      }
      $.ajax({
        url: "http://live.nicovideo.jp/api/getplayerstatus?v="+streamurl,
        type: "GET",
        dataType: "xml",
        cache : false,
        success: function (res) {
          if ($(res)[0].childNodes[0].attributes[0].nodeValue == "fail") {
            //console.log("end stream");
            return;
          }
          var live_status = $(res).find("archive")[0].childNodes[0].nodeValue; // 0:stream, 1:timeshift
          var nowurl = location.href.split("?")[0]; var nowlv = nowurl.split("lv")[1];
          nowurl = nowurl.replace(/gate/g, "watch");
          var nexturl = nowurl.split("lv")[0], nextlv = "";
          if ($(res).find("archive")[0].childNodes[0].nodeValue == '0') {
            nexturl += $(res).find("id")[0].childNodes[0].nodeValue;
            nextlv = $(res).find("id")[0].childNodes[0].nodeValue.split("lv")[1];
          }
          if (nowurl == nexturl || nextlv == "") {
            //console.log("this stream is latest");
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
  $("#scrollbutton").click( function () {
    if (localStorage.scrollflag == 1) {
      $("#scrollbutton").html("自動スクロール OFF");
      localStorage.scrollflag = 0;
    } else {
      $("#scrollbutton").html("自動スクロール ON");
      localStorage.scrollflag = 1;
    }
  });
});
