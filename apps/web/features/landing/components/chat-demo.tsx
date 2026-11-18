"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DEMO_EXAMPLES, LANDING_LINKS } from "../config";
import styles from "../styles/landing.module.css";
import { Arrow } from "./arrow";
import { Logo } from "./logo";

const turnSelector = "[data-turn]";

export const ChatDemo = () => {
	const [enhanced, setEnhanced] = useState(false);
	const [active, setActive] = useState(0);
	const [stacked, setStacked] = useState(false);
	const panelsRef = useRef<Array<HTMLDivElement | null>>([]);
	const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

	useEffect(() => {
		const media = window.matchMedia("(max-width: 740px)");
		const updateOrientation = () => setStacked(media.matches);

		updateOrientation();
		setEnhanced(true);
		media.addEventListener("change", updateOrientation);

		return () => media.removeEventListener("change", updateOrientation);
	}, []);

	const select = (index: number, animate = true) => {
		const changed = index !== active;
		setActive(index);

		if (!changed) return;

		for (const panel of panelsRef.current) {
			for (const animation of panel?.getAnimations({ subtree: true }) ?? []) {
				animation.cancel();
			}
		}

		const connection = (
			navigator as Navigator & { connection?: { saveData?: boolean } }
		).connection;
		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (!animate || reducedMotion || connection?.saveData) return;

		const panel = panelsRef.current[index];
		if (!panel) return;

		const turns = panel.querySelectorAll<HTMLElement>(turnSelector);
		turns.forEach((turn, turnIndex) => {
			turn.animate(
				[
					{ opacity: 0.35, transform: "translateY(5px)" },
					{ opacity: 1, transform: "translateY(0)" },
				],
				{
					duration: 210,
					delay: turnIndex * 45,
					fill: "backwards",
					easing: "cubic-bezier(.22, 1, .36, 1)",
				},
			);
		});
	};

	const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const focusedIndex = tabsRef.current.indexOf(
			document.activeElement as HTMLButtonElement,
		);
		const current = focusedIndex < 0 ? active : focusedIndex;
		let next: number | undefined;

		if (event.key === (stacked ? "ArrowRight" : "ArrowDown")) {
			next = (current + 1) % DEMO_EXAMPLES.length;
		} else if (event.key === (stacked ? "ArrowLeft" : "ArrowUp")) {
			next = (current + DEMO_EXAMPLES.length - 1) % DEMO_EXAMPLES.length;
		} else if (event.key === "Home") {
			next = 0;
		} else if (event.key === "End") {
			next = DEMO_EXAMPLES.length - 1;
		}

		if (next === undefined) return;

		event.preventDefault();
		select(next);
		tabsRef.current[next]?.focus();
	};

	const handleDemoKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key !== "Escape") return;

		const citation =
			panelsRef.current[active]?.querySelector<HTMLDetailsElement>(
				"details[open]",
			);

		if (!citation) return;

		citation.removeAttribute("open");
		tabsRef.current[active]?.focus();
	};

	return (
		<section
			id="demo"
			className={styles.demoSection}
			tabIndex={-1}
			aria-labelledby="demo-heading"
			onKeyDown={handleDemoKeyDown}
		>
			<div
				className={`${styles.demoLayout} ${styles.shell}`}
				data-enhanced={enhanced ? "" : undefined}
			>
				<div className={styles.demoGuide}>
					<div className={styles.demoIntro}>
						<h2 id="demo-heading">See Askly answer</h2>
						<p>Choose an example to see how Askly replies.</p>
					</div>
					<div
						className={styles.demoTabs}
						aria-label="Conversation examples"
						aria-orientation={stacked ? "horizontal" : "vertical"}
						hidden={!enhanced}
						role="tablist"
						onKeyDown={handleTabKeyDown}
					>
						{DEMO_EXAMPLES.map(({ name }, index) => (
							<button
								key={name}
								ref={(element) => {
									tabsRef.current[index] = element;
								}}
								type="button"
								id={`sample-tab-${index}`}
								role="tab"
								aria-selected={index === active}
								aria-controls={`sample-${index}`}
								tabIndex={index === active ? 0 : -1}
								onClick={() => select(index)}
							>
								<span className={styles.demoTabNumber} aria-hidden="true">
									{String(index + 1).padStart(2, "0")}
								</span>
								{name}
								<Arrow />
							</button>
						))}
					</div>
				</div>
				<div className={styles.demoStage}>
					<div className={styles.demoStageHeader}>
						<div className={styles.demoBrand}>
							<Logo size={22} /> Askly
						</div>
					</div>
					<div className={styles.demoPanels}>
						{DEMO_EXAMPLES.map(
							({ name, lang, question, reply, source, status }, index) => (
								<div
									key={name}
									ref={(element) => {
										panelsRef.current[index] = element;
									}}
									className={styles.demoPanel}
									id={`sample-${index}`}
									role="tabpanel"
									aria-labelledby={`sample-tab-${index}`}
									hidden={enhanced && index !== active}
								>
									<h3 className={styles.demoFallbackTitle}>{name}</h3>
									<div
										className={`${styles.demoTurn} ${styles.customerTurn}`}
										data-turn
									>
										<span className={styles.demoSpeaker}>Visitor</span>
										<p className={styles.customerMessage} lang={lang}>
											{question}
										</p>
									</div>
									<div
										className={`${styles.demoTurn} ${styles.agentTurn}`}
										data-turn
									>
										<span className={styles.demoSpeaker}>Askly</span>
										<p className={styles.agentMessage} lang={lang}>
											{reply}
										</p>
										{source ? (
											<details className={styles.citation}>
												<summary>
													<svg
														width="16"
														height="16"
														viewBox="0 0 16 16"
														fill="none"
														aria-hidden="true"
													>
														<path
															d="M4 2.5h5l3 3v8H4zM9 2.5v3h3M6 8h4m-4 2.5h4"
															stroke="currentColor"
															strokeWidth="1.4"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
													{source}
													<span
														className={styles.citationIndicator}
														aria-hidden="true"
													/>
												</summary>
												<p>
													Example doc: Go to Orders in your account and select
													Track order.
												</p>
											</details>
										) : null}
										{status ? (
											<p className={styles.demoStatus}>{status}</p>
										) : null}
									</div>
								</div>
							),
						)}
					</div>
				</div>
				<Link
					className={`${styles.inlineLink} ${styles.demoFeatures}`}
					href={LANDING_LINKS.features}
				>
					What Askly can do <Arrow />
				</Link>
			</div>
		</section>
	);
};
