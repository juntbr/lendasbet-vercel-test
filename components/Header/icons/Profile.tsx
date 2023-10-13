export default function Profile({ width, height, active = false }) {
  const color = active ? '#1EC355' : '#ffffff'
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      width={width}
      height={height}
      enableBackground="new 0 0 19.738 19.738"
      version="1.1"
      viewBox="0 0 19.738 19.738"
      xmlSpace="preserve"
    >
      <g fill={color}>
        <path d="M18.18 19.738h-2c0-3.374-2.83-6.118-6.311-6.118s-6.31 2.745-6.31 6.118h-2c0-4.478 3.729-8.118 8.311-8.118 4.581 0 8.31 3.64 8.31 8.118zM9.87 10.97a5.492 5.492 0 01-5.484-5.485A5.49 5.49 0 019.87 0c3.025 0 5.486 2.46 5.486 5.485S12.895 10.97 9.87 10.97zm0-8.97C7.948 2 6.385 3.563 6.385 5.485S7.948 8.97 9.87 8.97c1.923 0 3.486-1.563 3.486-3.485S11.791 2 9.87 2z"></path>
      </g>
    </svg>
  )
}
