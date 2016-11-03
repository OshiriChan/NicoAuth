$(function(){
  var stream_community = new Array();
  var stream_name = new Array();
  var save_com = new Array();
  var save_com_name = new Array();
  var setTimer;
  var timerflag = false, firstflag = true;
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
        stream_community = save_com;
        stream_name = save_com_name;
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
        var addr="", port="", thread="";
        $.ajax({
          url: "https://secure.nicovideo.jp/secure/login?site=nicoalert",
          type: "POST",
          dataType: "xml",
          data: {
            mail: request.mail,
            password: request.password
          },
          success: function (res) {
            console.log($(res).find("ticket")[0]);
            var community_num = new Array();
            if ($(res).find("ticket")[0] == undefined) {
              alert("メールアドレスまたはパスワードが間違っています");
              return;
            }
            $.ajax( {
              url: "http://alert.nicovideo.jp/front/getalertstatus",
              type: "POST",
              dataType: "xml",
              data: {
                ticket: $(res).find("ticket")[0].innerHTML
              },
              success: function (res) {
                 console.log(res);
                 var user_hash = $(res).find("user_hash")[0].childNodes[0].nodeValue;
                 var user_id = $(res).find("user_id")[0].childNodes[0].nodeValue;
                 addr = $(res).find("addr")[0].childNodes[0].nodeValue;
                 port = $(res).find("port")[0].childNodes[0].nodeValue;
                 thread = $(res).find("thread")[0].childNodes[0].nodeValue;
                //  console.log(user_hash);
                //  console.log(user_id);
                //  console.log(addr);
                //  console.log(port);
                //  console.log(thread);
                 $.ajax( {
                   url: "http://alert.nicovideo.jp/front/getcommunitylist",
                   type: "POST",
                   dataType: "xml",
                   data: {
                     user_hash:user_hash,
                     user_id:user_id
                   },
                   success: function (res) {
                    //console.log(res);
                    for (var i = 0; i < $($(res).find("service")[0]).find("id").length; i++) {
                      //console.log($($(res).find("service")[0]).find("id")[i].childNodes[0].nodeValue);
                      if ($($(res).find("service")[0]).find("id")[i].childNodes[0].nodeValue.indexOf("co") != -1) {
                        community_num.push($($(res).find("service")[0]).find("id")[i].childNodes[0].nodeValue);
                      }
                    }
                    localStorage.setItem("community", community_num);
                    alert('登録完了しました');
                    //socketGo(addr, port, thread);
                   }
                 });
              }
            });
            //console.log($(res).find("ticket")[0].innerHTML);
          }
        });
      }
    }
  );

function startTimer () {
  var cnt = 0;
  setTimer = setInterval (function () {
    if (localStorage.getItem("community") != undefined) {
      save_com = new Array();
      save_com_name = new Array();
      cnt = 0;
      chrome.browserAction.setBadgeText({text:String(0)});
      var communities = localStorage.getItem("community").split(",");
      for (var i = 0; i < communities.length; i++) {
        $.ajax({
          url: "http://com.nicovideo.jp/community/"+communities[i],
          dataType: "html",
          cache : false,
          type:"GET"
        }).done (function( res, textStatus, jqXHR ) {
          try {

            if ($(res).find(".now_live_inner")[0].href != undefined) {
              cnt++;
              console.log($.trim(($(res).find(".content")[0].childNodes[1].innerHTML)));
              console.log($(res).find(".now_live_inner")[0].href.split("/watch/")[1].split("?")[0]);
              save_com.push($(res).find(".now_live_inner")[0].href.split("/watch/")[1].split("?")[0]);
              save_com_name.push($.trim(($(res).find(".content")[0].childNodes[1].innerHTML)));
              chrome.browserAction.setBadgeText({text:String(cnt)});
            }

          } catch (e){
            //console.log("non stream");
          }
        })
        .fail(function( jqXHR, textStatus, errorThrown ) {
        })
        .always(function( jqXHR, textStatus ) {
          //console.log(stream_community);
        });
      }
    } else {
      alert("コミュニティが登録されていません");
      clearInterval(setTimer);
    }
  }, 10000);

  if (localStorage.getItem("community") != undefined) {
    cnt = 0;
    chrome.browserAction.setBadgeText({text:String(0)});
    var communities = localStorage.getItem("community").split(",");
    for (var i = 0; i < communities.length; i++) {
      $.ajax({
        url: "http://com.nicovideo.jp/community/"+communities[i],
        dataType: "html",
        cache : false,
        type:"GET"
      }).done (function( res, textStatus, jqXHR ) {
        try {

          if ($(res).find(".now_live_inner")[0].href != undefined) {
            cnt++;
            //console.log($.trim(($(res).find(".content")[0].childNodes[1].innerHTML)));
            //console.log($(res).find(".now_live_inner")[0].href.split("/watch/")[1].split("?")[0]);
            stream_community.push($(res).find(".now_live_inner")[0].href.split("/watch/")[1].split("?")[0]);
            stream_name.push($.trim(($(res).find(".content")[0].childNodes[1].innerHTML)));
            chrome.browserAction.setBadgeText({text:String(cnt)});
          }

        } catch (e){
          //console.log("non stream");
        }
      })
      .fail(function( jqXHR, textStatus, errorThrown ) {
      })
      .always(function( jqXHR, textStatus ) {
        //console.log(stream_community);
      });
    }
  } else {
    alert("コミュニティが登録されていません");
    clearInterval(setTimer);
  }
}
function stopTimer () {
  clearInterval(setTimer);
}

});

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details){

        for(var i=0; i<details.requestHeaders.length; i++){
            var header = details.requestHeaders[i];
            if(header.name == "Cookie"){
                //cookie 削除
                // クローズコミュはcookieを消さない
                if(details.url.match(/\?closed_community/)){
                    //console.log("closed_community");
                    //console.log(header.value);
                }else{
                    //普通のコミュならcookie削除
                    header.value = "";
                }
                break;
            }
        }
        //書き換えたヘッダを返却
        return {requestHeaders:details.requestHeaders};
        //}
    },
    {
        urls: [
            "http://com.nicovideo.jp/community/*",
            "http://ch.nicovideo.jp/*"
        ]
        ,
        types:[
            "xmlhttprequest"
        ]
    },
    [
        "requestHeaders",
        "blocking"
    ]
);
