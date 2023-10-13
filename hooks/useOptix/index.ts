type optionsTracker = {
  event_type: string
  event_uuid: string
  event_datetime: string
  event_value: string
  event_info_1: string
  event_info_2: string
  event_info_3: string | boolean
  userid: string
  contextid: string
  event_ref_id: string
  event_ref_type: string
  event_ccy: string
  event_language: string
  event_value_2: string
  event_value_3: string
  event_country: string
  event_platform: string
  event_location: string
  event_location_index: string
  event_channel: string
}

type eventName =
  | 'PAGE_VIEW'
  | 'GAME_PLAY'
  | 'LOGIN'
  | 'DEPOSIT'
  | 'REGISTRATION'
  | 'GAME_CLOSE'

interface IUseOptix {
  loadGraphyte: string
  identifier: (userID: string, affiliateId: string) => any
  tracker: (eventName: eventName, options: Partial<optionsTracker>) => any
}

const BRANDKEY = process.env.NEXT_PUBLIC_OPTIMOVE_BRAND_KEY
const APIKEY = process.env.NEXT_PUBLIC_OPTIMOVE_API_KEY

export const useOptix  = () : IUseOptix => {
  const loadGraphyte = `
  window.graphyte||(window.graphyte={}),window.graphyte_queue||(window.graphyte_queue=[]),function(){for(var e=['identify','track','trackLink','trackForm','trackClick','trackSubmit','page','pageview','ab','alias','ready','group','on','once','off'],t=function(t){return function(){var e=Array.prototype.slice.call(arguments);return e.unshift(t),graphyte_queue.push(e),window.graphyte;};},a=0;a<e.length;a++){var r=e[a];window.graphyte[r]=t(r);}}(),graphyte.load=function(t){var e=document.createElement('script');e.async=!0,e.type='text/javascript',e.src='https://cdn.graphyte.ai/graphyte.min.js',e.addEventListener?e.addEventListener('load',function(e){'function'==typeof t&&t(e);},!1):e.onreadystatechange=function(){'complete'!=this.readyState&&'loaded'!=this.readyState||t(window.event);};var a=document.getElementsByTagName('script')[0];a.parentNode.insertBefore(e,a);},graphyte.load(function(){for(graphyte.initialize({graphyte:{apiKey:'${APIKEY}',brandKey:'${BRANDKEY}'}});0<window.graphyte_queue.length;){var e=window.graphyte_queue.shift(),t=e.shift();graphyte[t]&&graphyte[t].apply(graphyte,e);}}),graphyte.page();
  `

  const identifier = (userID: string, affiliateId: string) => {
    return window?.graphyte.identify(userID, { affiliateId })
  }

  const tracker = (eventName: eventName, options: Partial<optionsTracker>) => {
    return window?.graphyte.track(eventName, options)
  }

  return {
    loadGraphyte,
    identifier,
    tracker,
  }
}
