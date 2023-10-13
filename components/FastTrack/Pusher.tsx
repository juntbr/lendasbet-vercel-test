import Script from 'next/script'

export default function Pusher() {
  return (
    <Script
      id="ft-pusher-load-script"
      async
      onLoad={() => {
        // Enable pusher logging - don't include this in production
        window.Pusher.logToConsole = false

        const pusher = new window.Pusher(
          process.env.NEXT_PUBLIC_FAST_TRACK_PUSHER_ID,
          {
            cluster: process.env.NEXT_PUBLIC_FAST_TRACK_PUSHER_CLUSTER,
          },
        )

        window.pusher = pusher

        const channel = pusher.subscribe(
          process.env.NEXT_PUBLIC_FAST_TRACK_PUSHER_CHANNEL,
        )

        window.channel = channel
        // channel.bind("my-event", function (data) {
        //   alert(JSON.stringify(data));
        // });
      }}
      src="https://js.pusher.com/7.2/pusher.min.js"
    ></Script>
  )
}
