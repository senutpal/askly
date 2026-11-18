import Link from "next/link";
import { LANDING_LINKS, SETUP_STEPS } from "../config";
import styles from "../styles/landing.module.css";
import { Arrow } from "./arrow";

export const Setup = () => {
	return (
		<section
			className={styles.setupSection}
			id="how"
			aria-labelledby="setup-heading"
		>
			<div className={`${styles.setupLayout} ${styles.shell}`}>
				<div className={styles.setupCopy}>
					<h2 id="setup-heading">
						On your site.
						<br /> In your team’s hands.
					</h2>
					<Link className={styles.inlineLink} href={LANDING_LINKS.setup}>
						Read the setup guide <Arrow />
					</Link>
				</div>
				<div className={styles.setupSteps}>
					{SETUP_STEPS.map(({ title, detail }, index) => (
						<details key={title} name="askly-setup" open={index === 0}>
							<summary>
								<span className={styles.stepNumber} aria-hidden="true">
									{String(index + 1).padStart(2, "0")}
								</span>
								<span>{title}</span>
								<span className={styles.stepIndicator} aria-hidden="true" />
							</summary>
							<p>{detail}</p>
						</details>
					))}
				</div>
			</div>
		</section>
	);
};
