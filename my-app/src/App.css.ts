import { style } from "@vanilla-extract/css";

export const app = style({
	display: "flex",
	height: "100vh",
	textAlign: "center",
});

export const mainArea = style({
	flex: 1,
	position: "relative",
});

export const header = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	fontSize: "calc(10px + 2vmin)",
	color: "white",
	width: "100%",
	height: "100%",
	padding: 0,
	margin: 0,
});

export const workbench = style({
	width: "99.3%",
	height: "98.9%",
	margin: "0",
	minHeight: "0",
	background: `
    repeating-linear-gradient(
      90deg,
      #a97c50 0px,
      #a97c50 60px,
      #8b6842 60px,
      #8b6842 120px
    ),
    linear-gradient(120deg, #b08d57 0%, #a97c50 100%)
  `,
	border: "6px solid #7a5a36",
	boxShadow: "0 8px 32px 0 rgba(60, 40, 10, 0.18) inset, 0 2px 8px #3e2712",
	position: "relative",
	overflow: "hidden",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
});

export const link = style({
	color: "#b318f0",
});

export const sidebar = style({
	width: "350px",
	background: "linear-gradient(135deg, #f8ecd4 80%, #e2c690 100%)",
	padding: "16px 8px 8px 8px",
	boxSizing: "border-box",
	gap: "8px",
	height: "100vh",
	position: "relative",
	borderLeft: "8px solid #b89b5e",
	borderRight: "8px solid #b89b5e",
	borderTop: "16px solid #d6b370",
	borderBottom: "16px solid #d6b370",
	boxShadow: "0 8px 32px 0 rgba(60, 40, 10, 0.25), 0 0 0 4px #e2c690 inset",
	fontFamily: '"Papyrus", "Caveat", "Comic Sans MS", cursive, serif',
	color: "#5c4326",
	overflow: "auto",
});

export const sidebarButtonsGrid = style({
	display: "flex",
	flexWrap: "wrap",
	gap: "6px",
	marginTop: "6px",
	flex: 1,
	alignItems: "flex-start",
	justifyContent: "flex-start",
});

export const sidebarbutton = style({
	background: "linear-gradient(135deg, #f8ecd4 80%, #e2c690 100%)",
	border: "2px solid #b89b5e",
	borderRadius: "12px 12px 18px 18px / 18px 18px 12px 12px",
	boxShadow: "0 4px 16px 0 rgba(60, 40, 10, 0.18), 0 0 0 2px #e2c690 inset",
	fontFamily: '"IM Fell English", "EB Garamond", "Times New Roman", serif',
	color: "#4b3621",
	fontSize: "1.1rem",
	fontWeight: 600,
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "12px",
	padding: "6px 14px",
	margin: "0",
	cursor: "pointer",
	transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
	outline: "none",
	minHeight: "48px",
	minWidth: "160px",
	maxWidth: "340px",
	":hover": {
		boxShadow: "0 0 0 4px #e2c690, 0 4px 16px 0 rgba(60, 40, 10, 0.22)",
		borderColor: "#e2c690",
		background: "linear-gradient(135deg, #f8ecd4 90%, #e2c690 100%)",
	},
});

export const sidebarButtonCompact = style([
	sidebarbutton,
	{
		minHeight: "32px",
		maxHeight: "32px",
		minWidth: "80px",
		maxWidth: "500px",
		fontSize: "1.1rem",
		padding: "1px 6px",
		margin: "0",
		borderRadius: "10px 10px 14px 14px / 14px 14px 10px 10px",
		boxSizing: "border-box",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		justifyContent: "center",
		gap: "4px",
		borderWidth: "2px",
		display: "flex",
		alignItems: "center",
		flex: "0 0 auto",
	},
]);

export const sidebarEmote = style({
	fontSize: "1.2rem",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	lineHeight: "1",
});

export const sidebarItemName = style({
	fontFamily: '"IM Fell English", "EB Garamond", "Times New Roman", serif',
	fontWeight: 600,
	fontSize: "0.85rem",
	color: "#5c4326",
	textAlign: "center",
	whiteSpace: "nowrap",
	overflow: "hidden",
	textOverflow: "ellipsis",
	lineHeight: "1",
	maxWidth: "90px",
});

export const sidebarSearchContainer = style({
	padding: "8px",
	background: "#f8ecd4",
	borderBottom: "1px solid #e2c690",
	position: "sticky",
	top: 0,
	zIndex: 2,
});

export const sidebarSearchInput = style({
	width: "100%",
	padding: "4px 8px",
	borderRadius: "6px",
	border: "1px solid #b89b5e",
	fontSize: "1rem",
	fontFamily: '"IM Fell English", "EB Garamond", "Times New Roman", serif',
	outline: "none",
	boxSizing: "border-box",
	background: "#fffbe9",
	color: "#5c4326",
	marginBottom: "2px",
});
