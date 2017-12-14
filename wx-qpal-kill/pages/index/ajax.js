const baseUrl = 'https://sum.kdcer.com/api/OpenShop/'

module.exports = {
  //==============  请求 - 入口
  entry: function (code, res, callback) {
    wx.request({
      url: baseUrl + 'CodeToSeckill',
      data: {
        code: code,
        iv: res.iv,
        encryptedDataStr: res.encryptedData,
        userJson: JSON.stringify(res.userInfo),
      },
      success: function (r) {
        console.log('入口', r.data);
        callback && callback(r);
      }
    })
  },
  //==============  请求 - 预约
  notice: function (sid, uid, formId, callback) {
    wx.request({
      url: baseUrl + 'SubscribeSeckill',
      data: {
        UnionId: uid,
        ScreeningId: sid,
        FormId: formId,
      },
      success: function (r) {
        console.log('预约', r.data);
        callback && callback(r);
      }
    })
  },
  //==============  请求 - 存 formId
  save: function (uid, formId, callback) {
    wx.request({
      url: baseUrl + 'FormSeckill',
      data: {
        UnionId: uid,
        FormId: formId,
      },
      success: function (r) {
        console.log('存 formId', r.data);
        callback && callback(r);
      }
    })
  },
  //==============  请求 - 抽奖
  prize: function (sid, uid, formId, callback) {
    wx.request({
      url: baseUrl + 'MerryChristmasLotteryBehavior',
      data: {
        UnionId: uid,
        ScreeningId: sid,
        FormId: formId,
      },
      success: function (r) {
        console.log('抽奖', r.data);
        // console.log(callback)
        callback && callback(r.data);
      }
    })
  },
  //==============  请求 - 添加到卡包
  card: function (uid, callback) {
    wx.request({
      url: baseUrl + 'AddCardSeckill',
      data: {
        UnionId: uid,
      },
      success: function (r) {
        console.log('接口-加入卡包', r.data);
        wx.hideLoading()
        if (!r.data.State) {
          wx.showModal({
            content: '您已添加过该卡券',
            showCancel: false,
          })
          return;
        }
        wx.addCard({
          cardList: [{
            cardId: 'pn96buEYd5IXeMoD3FnmQ3KcP7pg',
            cardExt: r.data.cardExt,
          }],
          success: function (res) {
            console.log('微信-加入卡包', res);
            callback && callback(res);
          }
        })
      }
    })
  }
}