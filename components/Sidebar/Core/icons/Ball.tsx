export default function Ball({ height, width }) {
  return (
    <svg
      height={height}
      width={width}
      className="S"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 126 126"
      fill="#747474"
    >
      <defs />

      <circle cx={63} cy={63} r={50} fill="url(#a)" />
      <path d="M105.3 67.1c2-5.9 1.1-18.4.8-21.2.6-.4 1.8-1.2 3-2.2a50.52 50.52 0 00-24.9-26c.8 1.4 3.8 7.1 4.4 13.7l-16.8 6.8C68.9 36.4 54 32.5 51 31.8L48.7 19c1.4-.7 8.1-4.2 13.7-6-10.4.1-20.1 3.4-28 9 4.3-1.2 10.7-2.8 13.7-2.9l2.3 12.6c-1.1 1.1-10 9.9-13.9 16.7-3.9.1-12.5 2.6-16 3.6-1-2.8-1-9.9-1.3-13.2C15.3 46 13 54.2 13 63c0 3.2.3 6.3.9 9.4 1.1.8 2.2 1.2 2.2 1.2.3-5.9 3.9-18.7 4.5-20.8 3.3-1 11.9-3.5 15.9-3.6.6 1.5 4.8 10.8 11.9 18.3-.7 2.3-4.7 15.4-5.6 20.6-4.7 1.2-15.4 2.2-15.4 2.2-.1 1.8 2.6 7.7 4.8 12.2 6.6 5.2 14.5 8.7 23.2 10.1 2.4-2.6 5.1-8 5.9-9.6 4.1-1.2 16.3-4.7 20.9-7.1.6.8 14.4 3.9 14.4 3.9 2.7-1.6 6.7-7 9.6-11.3 1.4-2.3 2.5-4.7 3.5-7.3-.6-4.4-3.7-12.1-4.4-14.1zM82.1 95c-4.1 2.3-16.8 6-21 7.2-5.8-3.3-16.4-13-17.7-14.2.9-5.1 4.8-17.8 5.5-20.3 2.3-.6 19.3-5.5 22.1-7.1l16.3 14.7c-.1 4.3-4.7 16.6-5.2 19.7zm5.6-20.2L71.3 60c.2-3 1-18.5 1.1-21.3l16.8-6.8c1.9 1.3 10.3 6.9 16.4 13.9.2 2.3 1.2 15.4-.8 21.2-4.6 3.1-14.9 7-17.1 7.8z" />
      <path
        fill="##747474"
        d="M27.2 90.4C21.7 86 16 74.2 15.8 73.7l.6-.3c.1.1 5.9 12.2 11.2 16.5l-.4.5z"
      />
      <path
        fill="#878787"
        d="M112.4 62.8c0 2.2-.1 4.4-.4 6.6 0 .3-.1.7-.1 1-1.1 7.1-3.7 13.7-7.4 19.4-.2.3-.4.7-.6 1-4.4 6.4-10.1 11.6-16.9 15.4-.5.3-1 .5-1.5.8-6.8 3.4-14.4 5.4-22.5 5.4h-2c-1.7-.1-3.4-.2-5-.5-9.5-1.4-18.1-5.4-25-11.3-.5-.4-1-.9-1.5-1.4-2.1-2-4.1-4.1-5.8-6.4 6.5 5 14.3 8.4 22.9 9.6 1.6.2 3.3.4 5 .5h2c8.1 0 15.8-2 22.5-5.4.5-.3 1-.5 1.5-.8 6.8-3.8 12.5-9 16.9-15.4.2-.3.4-.6.6-1 3.8-5.8 6.3-12.3 7.4-19.4.1-.3.1-.7.1-1 .3-2.1.4-4.3.4-6.6 0-11.2-3.7-21.6-10.1-29.9 11.8 9 19.5 23.3 19.5 39.4z"
        opacity=".2"
      />
    </svg>
  )
}
