;(function() {
  if (window.WebViewJavascriptBridge) {
    return
  }
  var messagingIframe
  var sendMessageQueue = []
  var receiveMessageQueue = []
  var messageHandlers = {}

  var CUSTOM_PROTOCOL_SCHEME = 'wvjbscheme'
  var QUEUE_HAS_MESSAGE = '__WVJB_QUEUE_MESSAGE__'
  var URL_BOOTSTRAP = 'URL_BOOTSTRAP_TAG';

    var responseCallbacks = {}
  var uniqueId = 1

  function _createQueueReadyIframe(doc) {
    messagingIframe = doc.createElement('iframe')
    messagingIframe.style.display = 'none'
    messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE
    doc.documentElement.appendChild(messagingIframe);
  }

  function _injectBootstrap() {
    var scriptElement = document.getElementById('teadsbootstrap');
    if (scriptElement) scriptElement.remove();
    var script = document.createElement('script');
    script.setAttribute('id', 'teadsbootstrap');
    script.setAttribute('src', URL_BOOTSTRAP);
    script.setAttribute('type', 'text/javascript');
    document.body.appendChild(script);
  }

  function init(messageHandler) {
    if (WebViewJavascriptBridge._messageHandler) {
      throw new Error('WebViewJavascriptBridge.init called twice')
    }
    WebViewJavascriptBridge._messageHandler = messageHandler
    var receivedMessages = receiveMessageQueue
    receiveMessageQueue = null
    if (receivedMessages) {
      for (var i = 0; i < receivedMessages.length; i++) {
        _dispatchMessageFromObjC(receivedMessages[i])
      }
    }
  }

  function send(data, responseCallback) {
    _doSend({
      data: data
    }, responseCallback)
  }

  function registerHandler(handlerName, handler) {
    messageHandlers[handlerName] = handler
  }

  function callHandler(handlerName, data, responseCallback) {
    _doSend({
      handlerName: handlerName,
      data: data
    }, responseCallback)
  }

  function _doSend(message, responseCallback) {
    if (responseCallback) {
      var callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime()
      responseCallbacks[callbackId] = responseCallback
      message['callbackId'] = callbackId
    }
    sendMessageQueue.push(message)
    messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE
  }

  function _fetchQueue() {
    var messageQueueString = JSON.stringify(sendMessageQueue)
    sendMessageQueue = []
    return messageQueueString
  }

  function _dispatchMessageFromObjC(messageJSON) {
    setTimeout(function _timeoutDispatchMessageFromObjC() {
      alert('in callback');
      var message = JSON.parse(messageJSON)
      var messageHandler
      var responseCallback

      if (message.responseId) {
        responseCallback = responseCallbacks[message.responseId]
        if (!responseCallback) {
          return;
        }
        responseCallback(message.responseData)
        delete responseCallbacks[message.responseId]
      } else {
        if (message.callbackId) {
          var callbackResponseId = message.callbackId
          responseCallback = function(responseData) {
            _doSend({
              responseId: callbackResponseId,
              responseData: responseData
            })
          }
        }

        var handler = WebViewJavascriptBridge._messageHandler
        if (message.handlerName) {
          handler = messageHandlers[message.handlerName]
        }

        try {
          handler(message.data, responseCallback)
        } catch (exception) {
          if (typeof console != 'undefined') {
            console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception)
          }
        }
      }
    })
  }

  function _handleMessageFromObjC(messageJSON) {
    if (receiveMessageQueue) {
      receiveMessageQueue.push(messageJSON)
    } else {
      _dispatchMessageFromObjC(messageJSON)
    }
  }

  window.WebViewJavascriptBridge = {
    init: init,
    send: send,
    registerHandler: registerHandler,
    callHandler: callHandler,
    _fetchQueue: _fetchQueue,
    _handleMessageFromObjC: _handleMessageFromObjC
  }

  var doc = document
  _createQueueReadyIframe(doc)
  var readyEvent = doc.createEvent('Events')
  readyEvent.initEvent('WebViewJavascriptBridgeReady')
  readyEvent.bridge = WebViewJavascriptBridge
  doc.dispatchEvent(readyEvent)

  setTimeout(function(){_injectBootstrap()});
})();