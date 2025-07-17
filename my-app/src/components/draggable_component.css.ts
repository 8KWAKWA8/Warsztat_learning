import { keyframes, style } from "@vanilla-extract/css";

export const draggableComponent = style({
	position: "absolute",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	background: "linear-gradient(135deg, #f8ecd4 80%, #e2c690 100%)",
	border: "2px solid #b89b5e",
	borderRadius: "10px 10px 14px 14px / 14px 14px 10px 10px",
	boxShadow: "0 2px 8px 0 rgba(60, 40, 10, 0.13), 0 0 0 1px #e2c690 inset",
	fontFamily: '"IM Fell English", "EB Garamond", "Times New Roman", serif',
	color: "#4b3621",
	fontSize: "1.1rem",
	padding: "1px 6px",
	height: "32px",
	minHeight: "32px",
	maxHeight: "32px",
	transition: "box-shadow 0.2s, border 0.2s",
	overflow: "hidden",
	minWidth: "90px",
	maxWidth: "200px",
	width: "auto",
	zIndex: 1000,
	userSelect: "none",
});

export const highlight = style({
	boxShadow: `
    0 0 0 6px #ffe066,
    0 0 16px 4px #ffe06688,
    0 4px 16px 0 rgba(60, 40, 10, 0.18)
  `,
	borderColor: "#ffe066",
	zIndex: 1100,
});

export const draggableEmote = style({
	fontSize: "1.2rem",
	margin: "0 2px",
	lineHeight: "1",
	display: "flex",
	alignItems: "center",
	height: "100%",
});

export const draggableEmoteLeft = style({
	marginRight: "8px",
});

export const draggableEmoteRight = style({
	marginLeft: "8px",
});

export const draggableName = style({
	fontFamily: '"IM Fell English", "EB Garamond", "Times New Roman", serif',
	fontWeight: 600,
	fontSize: "0.85rem",
	letterSpacing: "0.04em",
	color: "#5c4326",
	textShadow: "0 1px 0 #e2c690",
	lineHeight: "1",
});

export const draggableLoading = style({
	width: "100%",
	textAlign: "center",
	fontSize: "1.2em",
	color: "#888",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "100%",
	background: "rgba(255,255,255,0.7)",
	borderRadius: "inherit",
	fontFamily: '"IM Fell English", "EB Garamond", "Times New Roman", serif',
	fontWeight: 500,
	letterSpacing: "0.02em",
});

export const pulse = keyframes({
	"0%": {
		transform: "scale(1)",
		opacity: 1,
	},
	"50%": {
		transform: "scale(0.96)",
		opacity: 0.96,
	},
	"100%": {
		transform: "scale(1)",
		opacity: 1,
	},
});

export const draggableLoadingPulse = style({
	animation: `${pulse} 3s infinite`,
});
