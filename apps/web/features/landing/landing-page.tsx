import Link from "next/link";
import { Arrow } from "./components/arrow";
import { ChatDemo } from "./components/chat-demo";
import { DashboardPreview } from "./components/dashboard-preview";
import { Landscape } from "./components/landscape";
import { Setup } from "./components/setup";
import { SiteFooter } from "./components/site-footer";
import { SiteNav } from "./components/site-nav";
import { LANDING_LINKS } from "./config";
import { inter } from "./font";
import styles from "./styles/landing.module.css";

export const LandingPage = () => {
	return (
		<div className={`${inter.variable} ${styles.page}`} data-landing>
			<a className={styles.skipLink} href="#main">
				Skip to content
			</a>
			<Landscape />
			<SiteNav />
			<main id="main" className={styles.main} tabIndex={-1}>
				<section
					className={styles.hero}
					id="top"
					aria-labelledby="hero-heading"
				>
					<div className={styles.heroCopy}>
						<h1 id="hero-heading">
							Support that reads
							<br /> your docs
						</h1>
						<p>
							Askly answers in your customer’s language and sends the full
							conversation to your team when needed.
						</p>
						<div className={styles.heroActions}>
							<Link className={styles.startLink} href={LANDING_LINKS.signUp}>
								Get started <Arrow />
							</Link>
						</div>
					</div>
					<DashboardPreview />
				</section>
				<ChatDemo />
				<Setup />
			</main>
			<SiteFooter />
		</div>
	);
};
