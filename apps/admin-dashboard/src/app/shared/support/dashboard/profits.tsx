export default function TotalProfitsIcon({
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="45"
      height="44"
      viewBox="0 0 45 44"
      fill="none"
      {...props}
    >
      <path
        d="M10.6662 38.9054C19.1203 38.9054 24.9258 43.2846 28.9995 43.2846C33.0732 43.2846 41.6287 40.9428 41.6287 22.2025C41.6287 3.46216 30.1191 0.710938 25.6384 0.710938C4.65651 0.710938 -4.30604 38.9054 10.6662 38.9054Z"
        fill="#E2F5FF"
      />
      <text
        x="22" 
        y="29"
        fontSize="20"
        fill="#00A6ED"
        fontWeight="bold"
        textAnchor="middle"
      >
        $
      </text>
    </svg>
  );
}
