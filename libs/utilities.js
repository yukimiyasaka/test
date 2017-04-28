// Responder の初期化、Setter、Getter
exports.initResponder = function() {
  var fs = require("fs");
  fs.writeFileSync(
    "./public/responder.json",
    JSON.stringify({
      name: "BOT", // LIVEAGENT
      status: "CONNECTED", // WAITING, DISCONNECTED
      options: {}
    }),
    "utf8"
  );
};
exports.getResponder = function() {
  delete require.cache[require.resolve("../public/responder.json")];
  return require("../public/responder.json");
};
exports.setResponder = function(responder) {
  var fs = require("fs");
  fs.writeFileSync(
    "./public/responder.json",
    JSON.stringify(responder),
    "utf8"
  );
};

// Session の初期化、Setter、Getter
exports.initSession = function() {
  var fs = require("fs");
  fs.writeFileSync("./public/session.json", JSON.stringify({}), "utf8");
};
exports.getSession = function() {
  delete require.cache[require.resolve("../public/session.json")];
  return require("../public/session.json");
};
exports.setSession = function(session) {
  var fs = require("fs");
  fs.writeFileSync("./public/session.json", JSON.stringify(session), "utf8");
};

// LineConnection の初期化、Setter、Getter
exports.initLineConnection = function() {
  var fs = require("fs");
  fs.writeFileSync(
    "./public/line.json",
    JSON.stringify({
      channelId: process.env.LINE_CHANNEL_ID,
      secret: process.env.LINE_CHANNEL_SECRET,
      token: process.env.LINE_CHANNEL_ACCESS_TOKEN
    }),
    "utf8"
  );
};
exports.getLineConnection = function() {
  delete require.cache[require.resolve("../public/line.json")];
  return require("../public/line.json");
};
exports.setLineConnection = function(line) {
  var fs = require("fs");
  fs.writeFileSync("./public/line.json", JSON.stringify(line), "utf8");
};

// LiveagnetConnection の初期化、Setter、Getter
exports.initLiveagentConnection = function() {
  var fs = require("fs");
  fs.writeFileSync(
    "./public/liveagent.json",
    JSON.stringify({
      laPod: process.env.LIVEAGENT_POD,
      orgId: process.env.LIVEAGENT_ORGANIZATION_ID,
      deploymentId: process.env.LIVEAGENT_DEPLOYMENT_ID,
      buttonId: process.env.LIVEAGENT_BUTTON_ID
    }),
    "utf8"
  );
};
exports.getLiveagentConnection = function() {
  delete require.cache[require.resolve("../public/liveagent.json")];
  return require("../public/liveagent.json");
};
exports.setLiveagentConnection = function(liveagent) {
  var fs = require("fs");
  fs.writeFileSync(
    "./public/liveagent.json",
    JSON.stringify(liveagent),
    "utf8"
  );
};

exports.replyMessage = function(line, event, messageList) {
  var request = require("request");
  //ヘッダーを定義
  var headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer {" + line.token + "}"
  };
  var body = {
    replyToken: event.replyToken,
    messages: messageList
  };
  var options = {
    url: "https://api.line.me/v2/bot/message/reply",
    proxy: process.env.FIXIE_URL,
    headers: headers,
    json: true,
    body: body
  };
  request.post(options, function(error, response, body) {
    if (error || response.statusCode != 200) {
      handleError(error, body);
      return;
    }
  });
};

exports.pushMessage = function(line, messageList) {
  var request = require("request");
  //ヘッダーを定義
  var headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer {" + line.token + "}"
  };

  //オプションを定義
  var options = {
    url: "https://api.line.me/v2/bot/message/push",
    proxy: process.env.FIXIE_URL,
    headers: headers,
    json: true,
    body: { to: line.user.id, messages: messageList }
  };

  request.post(options, function(error, response, body) {
    if (error || response.statusCode != 200) {
      handleError(error, body);
      return;
    }
  });
};

exports.getUserProfile = function(line, userId, callback) {
  var request = require("request");
  var options = {
    url: "https://api.line.me/v2/bot/profile/" + userId,
    proxy: process.env.FIXIE_URL,
    json: true,
    headers: {
      Authorization: "Bearer {" + line.token + "}"
    }
  };
  request.get(options, function(error, response, body) {
    if (error || response.statusCode != 200) {
      handleError(error, body);
      return;
    }
    var user = {
      id: body.userId,
      name: body.displayName,
      imageUrl: body.pictureUrl
    };
    callback(user);
  });

};

exports.getContent = function(line, message, callback) {
  var request = require("request");
  var options = {
    url: "https://api.line.me/v2/bot/message/" + message.id + "/content",
    proxy: process.env.FIXIE_URL,
    json: true,
    headers: {
      Authorization: "Bearer {" + line.token + "}",
      "Content-type": "application/json; charset=UTF-8",
    }
  };


  request(options, function (error, response, body) {
      // body is the decompressed response body 
      //console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
      //console.log('the decoded data is: ')
       console.log('callback');
    }
  ).on('data', function(data) {
    // decompressed data as it is received 
    console.log('ondata');
  })
  .on('response', function(response) {
    // unmodified http.IncomingMessage object 
    response.on('data', function(data) {
      // compressed data as it is received 
      //console.log('received ' + data.length + ' bytes of compressed data')
      console.log('respose-ondata');
    })
  })






/*
var https = require('https');

req = https.request(options, function(res) {
    res.setEncoding('binary');

    var data = [ ];

    res.on('data', function(chunk) {
        data.push(chunk);
    });
    res.on('end', function() {
      fs.writeFile('./public/tmp.jpeg', Buffer.concat(buffers), 'utf-8', (err) => {
if(err) {
 console.log(err);
 return;
}
console.log('成功');
});
    });
    res.on('error', function(err) {
        console.log("Error during HTTP request");
        console.log(err.message);
    });
});
*/


/*
  request.get(options, function(error, response, body) {

    if (error || response.statusCode != 200) {
      handleError(error, body);
      return;
    }

  }).on('data', function(data) {
    // decompressed data as it is received 
    console.log('decoded chunk: ' + data)
  })
  .on('response', function(response) {
    // unmodified http.IncomingMessage object 
    response.on('data', function(data) {
      // compressed data as it is received 
      console.log('received ' + data.length + ' bytes of compressed data')
    })
   var base64data = new Buffer(body, 'binary').toString('base64');
   var content = {
      type: response.headers["content-type"],
      length: response.headers["content-length"],
      data: base64data
    };
    callback(content);

  });
  */
};

exports.parseQuery = function(str) {
  var query = {};
  var a = str.split("&");
  for (var i = 0; i < a.length; i++) {
    var b = a[i].split("=");
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "");
  }
  return query;
};

function handleError(error, body) {
  console.error(body.message);
  if (body.details && body.details.length > 0) {
    body.details.forEach(function(detail) {
      console.error(detail.property + ": " + detail.message);
    });
  }
}
