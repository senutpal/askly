import Image from "next/image";
import dashboard from "../assets/dashboard-overview.png";
import styles from "../styles/landing.module.css";

const sizes =
	"(max-width: 660px) calc(100vw - 46px), (max-width: 1064px) calc(100vw - 70px), 994px";

export const DashboardPreview = () => {
	return (
		<figure className={styles.dashboardPreview}>
			<Image
				className={styles.dashboardImage}
				src={dashboard}
				sizes={sizes}
				quality={85}
				loading="lazy"
				decoding="async"
				alt="Example Askly dashboard showing the overview, conversations, and quick actions."
			/>
		</figure>
	);
};
