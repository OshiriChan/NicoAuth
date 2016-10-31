$(function(){
  var stream_community = new Array();
  var stream_name = new Array();
  if (localStorage.streamflag == undefined) {
    localStorage.streamflag = "0";
  }
  /*
  * popup.jsからのメッセージ受信
  * comget: 現在放送しているコミュにティ
  * streamflag: アラート機能のON・OFF
  *
  */
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      //console.log(request.comget);
      if (request.comget != undefined) {
        sendResponse({com:stream_community, name:stream_name});
      } else if (request.streamflag != undefined) {
        console.log(request.streamflag);
        localStorage.streamflag= request.streamflag;
      }
      if ((localStorage.mail == undefined || localStorage.password == undefined) && request.greeting == "first") {
        sendResponse({res: "non"});
      } else if (localStorage.mail != undefined && localStorage.password != undefined) {
        sendResponse({res: "1", mail: localStorage.mail, password: localStorage.password});
      }
      if (request.mail != undefined && request.password != undefined) {
        if (request.save == "1") {
          localStorage.mail = request.mail;
          localStorage.password = request.password;
        }
        // console.log(request.mail);
        // console.log(request.save);
        $.ajax({
          url: "https://secure.nicovideo.jp/secure/login?site=nicolive_antenna",
          type: "POST",
          dataType: "xml",
          data: {
            mail: request.mail,
            password: request.password
          },
          success: function (res) {
            var community_num = new Array();
            if ($(res).find("ticket")[0] == undefined) {
              alert("メールアドレスまたはパスワードが間違っています");
              return;
            }
            $.ajax( {
              url: "http://live.nicovideo.jp/api/getalertstatus",
              type: "POST",
              dataType: "xml",
              data: {
                ticket: $(res).find("ticket")[0].innerHTML
              },
              success: function (res) {
                for (var i = 0; i < $(res).find("community_id").length; i++) {
                  //console.log($(res).find("community_id")[i].childNodes[0].nodeValue);
                  community_num.push($(res).find("community_id")[i].childNodes[0].nodeValue);
                }
                //console.log($(res).find("community_id").length);
                localStorage.setItem("community", community_num);
                alert('登録完了しました');
              }
            });
            //console.log($(res).find("ticket")[0].innerHTML);
          }
        });
      }
    }
  );

  if (localStorage.getItem("community") != undefined) {
    setInterval(function(){
      if (localStorage.streamflag == "1") {
        var communities = localStorage.getItem("community").split(",");
        stream_community = new Array();
        stream_name = new Array();
        var cnt = 0;
        for (var i = 0; i < communities.length; i++) {
          $.ajax({
            url: "http://live.nicovideo.jp/api/getplayerstatus?v="+communities[i],
            type: "GET",
            dataType: "xml",
            cache : false,
            success: function (res) {
              if ($(res)[0].childNodes[0].attributes[0].nodeValue == "fail") {
                return;
              }
              var live_status = $(res).find("archive")[0].childNodes[0].nodeValue; // 0:stream, 1:timeshift
              if (live_status == "0") {
                //console.log($(res).find("default_community")[0].childNodes[0].nodeValue);
                stream_community.push($(res).find("default_community")[0].childNodes[0].nodeValue);
                stream_name.push($(res).find("owner_name")[0].childNodes[0].nodeValue);
                cnt++;
                chrome.browserAction.setBadgeText({text:String(cnt)});
              }
            }
          });
        }
      }
    },10000);
  }
//  },5000);
});
