import styles from "../styles/landing.module.css";

export const Arrow = () => {
	return (
		<svg
			className={styles.arrow}
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M2.5 8h10m-4-4 4 4-4 4"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
