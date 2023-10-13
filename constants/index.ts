export const SESSION_STORAGE = 'lendasbet:sessionId'
export const CID_STORAGE = 'cid'
export const AFFILIATE_CODE = 'btag'

export const REFER_FRIEND_CODE = 'referfriendcode'
export const HAS_BONUS = 'coupon'
export const HAS_CUSTOMER_SERVICE = 'cs'

type Event = {
  name?: string
  scriptContent?: string
  noScript?: string
  scriptUrl?: string
}

type Affiliate = {
  id: string
  events: Event[]
  scriptContent?: string
  scriptUrl?: string
}

type MAJOR_AFFILIATES = {
  [key: string]: Affiliate
}

export const MAJOR_AFFILIATES: MAJOR_AFFILIATES = {
  '43992294': {
    id: '43992294',
    events: [
      {
        name: 'registration',
        scriptContent: `function a(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],a("js",new Date),a("config","AW-11125520032"),a("event","conversion",{send_to:"AW-11125520032/HfGJCJWHj5oYEKDth7kp",value:10,currency:"BRL"});`,
      },
      {
        name: 'deposit',
        scriptContent: `function a(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],a("js",new Date),a("config","AW-11125520032"),a("event","conversion",{send_to:"AW-11125520032/XutICJS3zJoYEKDth7kp",value:50,currency:"BRL",transaction_id:""});`,
      },
    ],
    scriptUrl: 'https://www.googletagmanager.com/gtag/js?id=AW-11125520032',
  },

  '44035285': {
    id: '44035285',
    events: [
      {
        name: 'deposit',
        scriptContent: `!function(e,t,n,c,a,o,f){e.fbq||(a=e.fbq=function(){a.callMethod?a.callMethod.apply(a,arguments):a.queue.push(arguments)},e._fbq||(e._fbq=a),a.push=a,a.loaded=!0,a.version="2.0",a.queue=[],(o=t.createElement(n)).async=!0,o.src="https://connect.facebook.net/en_US/fbevents.js",(f=t.getElementsByTagName(n)[0]).parentNode.insertBefore(o,f))}(window,document,"script"),fbq("init","1466964027015183"),fbq("track","PageView"),fbq("track","Purchase");`,
        noScript: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1466964027015183&ev=PageView&noscript=1" />`,
      },
    ],
  },

  '37930463': {
    id: '37930463',
    events: [
      {
        name: 'deposit',
        scriptContent: `!function(e,t,n,a,c,o,s){e.fbq||(c=e.fbq=function(){c.callMethod?c.callMethod.apply(c,arguments):c.queue.push(arguments)},e._fbq||(e._fbq=c),c.push=c,c.loaded=!0,c.version="2.0",c.queue=[],(o=t.createElement(n)).async=!0,o.src=a,(s=t.getElementsByTagName(n)[0]).parentNode.insertBefore(o,s))}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js"),fbq("init","988306658947196"),fbq("track","PageView");`,
        noScript: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=988306658947196&ev=PageView&noscript=1"/>`,
      },
    ],
  }
}
