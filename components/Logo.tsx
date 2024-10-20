export default function Logo({
	width = 50,
	height = 50,
	color = '#22C55E'
}: {
	width?: number;
	height?: number;
	color?: string;
}) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 50 50"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="Online Education Platform Logo"
		>
			<title>Online Education Platform Logo</title>
			<rect width="50" height="50" rx="10" fill={color} />
			<path d="M25 10L10 18L25 26L40 18L25 10Z" fill="white" />
			<path
				d="M10 32L25 40L40 32"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M10 25L25 33L40 25"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
