// 调用微信JS api 支付
function jsApiCall(jsApiParameters) {
  return new Promise((resolve, reject) => {
    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        appId: jsApiParameters.appId,
        timeStamp: jsApiParameters.timeStamp.toString(),
        nonceStr: jsApiParameters.nonceStr,
        package: jsApiParameters.package,
        signType: jsApiParameters.signType,
        paySign: jsApiParameters.paySign
      }, (res) => {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          resolve(res)
        } else {
          reject(res)
        }
      }
    )
  })
}
export default (jsApiParameters) => {
  if (typeof window.WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', jsApiCall, false)
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', jsApiCall)
      document.attachEvent('onWeixinJSBridgeReady', jsApiCall)
    }
  } else {
    return jsApiCall(jsApiParameters)
  }
}
