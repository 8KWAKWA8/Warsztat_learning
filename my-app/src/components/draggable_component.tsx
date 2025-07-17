import * as styles from "./draggable_component.css";

type DraggableComponentProps = {
	emote: string;
	name: string;
	pos: { x: number; y: number; width: number; height: number };
	setPos: (pos: {
		x: number;
		y: number;
		width: number;
		height: number;
	}) => void;
	highlight?: boolean;
	loading?: boolean;
	id: string;
	onRelease?: (id: string, x: number, y: number) => void;
	onMouseDown?: () => void;
};

const DraggableComponent = (props: DraggableComponentProps) => {
	let offset = { x: 0, y: 0 };
	let dragging = false;

	const onMouseDown = (e: MouseEvent) => {
		dragging = true;
		offset = {
			x: e.clientX - props.pos.x,
			y: e.clientY - props.pos.y,
		};
		if (props.onMouseDown) props.onMouseDown();
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
	};

	const onMouseMove = (e: MouseEvent) => {
		if (dragging) {
			props.setPos({
				x: e.clientX - offset.x,
				y: e.clientY - offset.y,
				width: props.pos.width,
				height: props.pos.height,
			});
		}
	};

	const onMouseUp = () => {
		dragging = false;
		window.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("mouseup", onMouseUp);
		if (props.onRelease) {
			props.onRelease(props.id, props.pos.x, props.pos.y);
		}
	};

	// Use a local variable for cursor style
	const cursor = dragging ? "grabbing" : "grab";

	return (
		<button
			type="button"
			class={[
				styles.draggableComponent,
				props.highlight ? styles.highlight : "",
				props.loading ? styles.draggableLoadingPulse : "",
			].join(" ")}
			style={{
				left: `${props.pos.x}px`,
				top: `${props.pos.y}px`,
				cursor,
				position: "absolute",
			}}
			onMouseDown={onMouseDown}
			tabIndex={0}
		>
			<span
				class={[styles.draggableEmote, styles.draggableEmoteLeft].join(" ")}
			>
				{props.emote}
			</span>
			<span class={styles.draggableName}>{props.name}</span>
			<span
				class={[styles.draggableEmote, styles.draggableEmoteRight].join(" ")}
			>
				{props.emote}
			</span>
		</button>
	);
};

export default DraggableComponent;
