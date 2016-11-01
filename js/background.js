$(function(){
  var stream_community = new Array();
  var stream_name = new Array();
  var setTimer;
  var timerflag = false;
  if (localStorage.streamflag == undefined) {
    localStorage.streamflag = "0";
  } else {
    if (localStorage.streamflag == "1") {
      timerflag = true;
      startTimer();
    }
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
        console.log(stream_community);
        console.log(stream_name);
        sendResponse({com:stream_community, name:stream_name});
      } else if (request.streamflag != undefined) {
        if (request.streamflag == "1") {
          timerflag = true;
          startTimer();
        } else if (request.streamflag == "0" && timerflag == true) {
          stream_community = new Array();
          stream_name = new Array();
          timerflag = false;
          stopTimer();
        }
        localStorage.streamflag = request.streamflag;
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
                  if ($(res).find("community_id")[i].childNodes[0].nodeValue.indexOf("co") != -1) {
                    community_num.push($(res).find("community_id")[i].childNodes[0].nodeValue);
                  }
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

//   if (localStorage.getItem("community") != undefined) {
//     //setInterval(function(){
//       if (localStorage.streamflag == "1") {
//         var communities = localStorage.getItem("community").split(",");
//         stream_community = new Array();
//         stream_name = new Array();
//         var cnt = 0;
//         var i = 0;
//         var timeinterval = setInterval(function(){
//           console.log(i);
//           if (i == communities.length) {
//             console.log("ok");
//             clearInterval(timeinterval);
//           }
//           $.ajax({
//             url: "http://live.nicovideo.jp/api/getplayerstatus?v="+communities[i],
//             type: "GET",
//             dataType: "xml",
//             cache : false,
//             success: function (res) {
//               if ($(res)[0].childNodes[0].attributes[0].nodeValue == "fail") {
//                 return;
//               }
//               var live_status = $(res).find("archive")[0].childNodes[0].nodeValue; // 0:stream, 1:timeshift
//               if (live_status == "0") {
//                 //console.log($(res).find("default_community")[0].childNodes[0].nodeValue);
//                 stream_community.push($(res).find("default_community")[0].childNodes[0].nodeValue);
//                 stream_name.push($(res).find("owner_name")[0].childNodes[0].nodeValue);
//                 cnt++;
//                 chrome.browserAction.setBadgeText({text:String(cnt)});
//               }
//             }
//           });
//           i++;
//         }, 500);
//       }
//     //},1000);
//   }
// //  },5000);

  function startTimer () {
    var i = 0;
    var cnt = 0;
    var save_com = new Array();
    var save_com_name = new Array();
    setTimer = setInterval (function () {
      if (localStorage.getItem("community") != undefined) {
        var communities = localStorage.getItem("community").split(",");
        if (i == communities.length) {
          i = 0;
          chrome.browserAction.setBadgeText({text:String(cnt)});
          stream_community = save_com;
          stream_name = save_com_name;
          save_com = new Array();
          save_com_name = new Array();
          cnt = 0;
        }
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
              console.log($(res).find("owner_name")[0].childNodes[0].nodeValue);
              save_com.push($(res).find("default_community")[0].childNodes[0].nodeValue);
              save_com_name.push($(res).find("owner_name")[0].childNodes[0].nodeValue);
              cnt++;
            }
          }
        });
        i++;
      } else {
        console.log("not save community");
      }
    }, 1000);
  }

  function stopTimer () {
    clearInterval(setTimer);
  }
});
