"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LANDING_LINKS } from "../config";
import styles from "../styles/landing.module.css";
import { Arrow } from "./arrow";
import { Logo } from "./logo";

const focusableSelector = "a[href], button:not([disabled])";

const isCurrentTabClick = (event: React.MouseEvent<HTMLAnchorElement>) =>
	event.button === 0 &&
	!event.altKey &&
	!event.ctrlKey &&
	!event.metaKey &&
	!event.shiftKey;

export const SiteNav = () => {
	const [open, setOpen] = useState(false);
	const navRef = useRef<HTMLElement>(null);
	const brandRef = useRef<HTMLAnchorElement>(null);
	const toggleRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const media = window.matchMedia("(max-width: 660px)");
		const closeOnDesktop = (event: MediaQueryListEvent) => {
			if (event.matches) return;

			const activeElement = document.activeElement;
			const focusLost =
				activeElement === toggleRef.current ||
				(activeElement instanceof HTMLElement &&
					Boolean(activeElement.closest("#landing-mobile-menu")));

			setOpen(false);

			if (focusLost) brandRef.current?.focus();
		};

		media.addEventListener("change", closeOnDesktop);

		return () => media.removeEventListener("change", closeOnDesktop);
	}, []);

	useEffect(() => {
		if (!open) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [open]);

	const closeMenu = () => setOpen(false);

	const closeMenuForHash = (href: string) => {
		setOpen(false);
		requestAnimationFrame(() => {
			document.getElementById(href.slice(1))?.focus();
		});
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (!open) return;

		if (event.key === "Escape") {
			event.preventDefault();
			setOpen(false);
			toggleRef.current?.focus();
			return;
		}

		if (event.key !== "Tab") return;

		const focusable = Array.from(
			navRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
		).filter((element) => element.offsetParent !== null);

		const first = focusable.at(0);
		const last = focusable.at(-1);

		if (!first || !last) return;

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};

	return (
		<header
			className={`${styles.header} ${styles.shell} ${open ? styles.headerOpen : ""}`}
		>
			<nav
				ref={navRef}
				className={styles.nav}
				aria-label="Main navigation"
				onKeyDown={handleKeyDown}
			>
				<a
					ref={brandRef}
					className={styles.brand}
					href={LANDING_LINKS.top}
					aria-label="Askly home"
					onClick={closeMenu}
				>
					<Logo size={20} />
					<span>Askly</span>
				</a>
				<div className={styles.navLinks}>
					<a href={LANDING_LINKS.demo}>Demo</a>
					<Link href={LANDING_LINKS.docs}>Docs</Link>
				</div>
				<Link className={styles.signIn} href={LANDING_LINKS.signIn}>
					Sign in <Arrow />
				</Link>
				<button
					ref={toggleRef}
					type="button"
					className={styles.menuToggle}
					aria-expanded={open}
					aria-controls="landing-mobile-menu"
					onClick={() => {
						if (!open) toggleRef.current?.focus();
						setOpen((value) => !value);
					}}
				>
					<span className={styles.visuallyHidden}>
						{open ? "Close menu" : "Menu"}
					</span>
					<span
						className={`${styles.menuIcon} ${open ? styles.menuIconOpen : ""}`}
						aria-hidden="true"
					>
						<span />
						<span />
						<span />
					</span>
				</button>
				<div
					id="landing-mobile-menu"
					className={styles.mobileLinks}
					hidden={!open}
				>
					<a
						href={LANDING_LINKS.demo}
						onClick={(event) => {
							if (isCurrentTabClick(event)) {
								closeMenuForHash(LANDING_LINKS.demo);
							}
						}}
					>
						Demo <Arrow />
					</a>
					<Link
						href={LANDING_LINKS.docs}
						onClick={(event) => {
							if (isCurrentTabClick(event)) closeMenu();
						}}
					>
						Docs <Arrow />
					</Link>
					<Link
						href={LANDING_LINKS.signIn}
						onClick={(event) => {
							if (isCurrentTabClick(event)) closeMenu();
						}}
					>
						Sign in <Arrow />
					</Link>
				</div>
			</nav>
		</header>
	);
};
