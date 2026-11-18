import Link from "next/link";
import { LANDING_LINKS } from "../config";
import styles from "../styles/landing.module.css";
import { Logo } from "./logo";

export const SiteFooter = () => {
	return (
		<footer className={styles.siteFooter}>
			<div className={`${styles.shell} ${styles.footerRow}`}>
				<a
					className={`${styles.brand} ${styles.footerBrand}`}
					href={LANDING_LINKS.top}
					aria-label="Askly home"
				>
					<Logo size={16} />
					<span>Askly</span>
				</a>
				<p>© 2026 Askly</p>
				<nav aria-label="Footer navigation">
					<Link href={LANDING_LINKS.docs}>Docs</Link>
					<a href={LANDING_LINKS.github}>GitHub</a>
				</nav>
			</div>
		</footer>
	);
};
