(() => {
	const o = {
			WIDGET_URL: "https://askly-widget.vercel.app",
			DEFAULT_POSITION: "bottom-right",
		},
		h = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
</svg>`,
		w = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`,
		T = ["askly:open", "askly:close", "askly:toggle"],
		isAskly = (d) =>
			typeof d === "object" &&
			d !== null &&
			typeof d.type === "string" &&
			T.includes(d.type);
	(() => {
		let n = null,
			t = null,
			e = null,
			d = !1,
			l = !1,
			S = null,
			r = null,
			a = o.DEFAULT_POSITION;
		const c = document.currentScript;
		if (c)
			(r = c.getAttribute("data-organization-id")),
				(a = c.getAttribute("data-position") || o.DEFAULT_POSITION);
		else {
			const i = document.querySelectorAll('script[src*="embed"]'),
				s = Array.from(i).find((l) => l.hasAttribute("data-organization-id"));
			s &&
				((r = s.getAttribute("data-organization-id")),
				(a = s.getAttribute("data-position") || o.DEFAULT_POSITION));
		}
		if (!r) {
			console.error("Askly Widget: data-organization-id attribute is required");
			return;
		}
		function g() {
			document.readyState === "loading"
				? document.addEventListener("DOMContentLoaded", f)
				: f();
		}
		function f() {
			(e = document.createElement("button")),
				(e.id = "askly-widget-button"),
				(e.type = "button"),
				e.setAttribute("aria-label", "Open Askly support chat"),
				e.setAttribute("aria-expanded", "false"),
				(e.innerHTML = h),
				(e.style.cssText = `
      position: fixed;
      ${a === "bottom-right" ? "right: 20px;" : "left: 20px;"}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      border: none;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px rgba(59, 130, 246, 0.35);
      transition: all 0.2s ease;
    `),
				e.addEventListener("click", v),
				e.addEventListener("mouseenter", () => {
					e && (e.style.transform = "scale(1.05)");
				}),
				e.addEventListener("mouseleave", () => {
					e && (e.style.transform = "scale(1)");
				}),
				document.body.appendChild(e),
				(t = document.createElement("div")),
				(t.id = "askly-widget-container"),
				(t.style.cssText = `
      position: fixed;
      ${a === "bottom-right" ? "right: 20px;" : "left: 20px;"}
      bottom: 90px;
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      z-index: 999998;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `),
				(n = document.createElement("iframe")),
				(n.title = "Askly support chat"),
				(n.loading = "lazy"),
				n.setAttribute(
					"sandbox",
					"allow-scripts allow-forms allow-same-origin allow-popups allow-downloads",
				),
				(n.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `),
				(n.allow = "microphone; clipboard-read; clipboard-write"),
				t.appendChild(n),
				document.body.appendChild(t),
				window.addEventListener("message", m);
		}
		function y() {
			const i = new URLSearchParams();
			return i.append("organizationId", r), `${o.WIDGET_URL}?${i.toString()}`;
		}
		function m(i) {
			let p;
			try {
				p = new URL(o.WIDGET_URL).origin;
			} catch (E) {
				console.error("Askly Widget: Invalid WIDGET_URL configuration", E);
				return;
			}
			const fromHost =
					i.origin === window.location.origin && i.source === window,
				fromWidget = i.origin === p && n && i.source === n.contentWindow;
			if (!fromHost && !fromWidget) return;
			if (!isAskly(i.data)) return;
			switch (i.data.type) {
				case "askly:open":
					x();
					break;
				case "askly:close":
					u();
					break;
				case "askly:toggle":
					v();
					break;
			}
		}
		function q(type) {
			if (!l || !n || !n.contentWindow) return;
			try {
				n.contentWindow.postMessage({ type }, new URL(o.WIDGET_URL).origin);
			} catch {}
		}
		function v() {
			d ? u() : x();
		}
		function x() {
			t &&
				e &&
				((d = !0),
				S && clearTimeout(S),
				(S = null),
				!l && n && ((n.src = y()), (l = !0)),
				(t.style.display = "block"),
				(S = setTimeout(() => {
					t && ((t.style.opacity = "1"), (t.style.transform = "translateY(0)"));
				}, 10)),
				(e.innerHTML = w),
				e.setAttribute("aria-label", "Close Askly support chat"),
				e.setAttribute("aria-expanded", "true"),
				q("askly:open"));
		}
		function u() {
			t &&
				e &&
				((d = !1),
				S && clearTimeout(S),
				(S = null),
				(t.style.opacity = "0"),
				(t.style.transform = "translateY(10px)"),
				(S = setTimeout(() => {
					t && (t.style.display = "none");
				}, 300)),
				(e.innerHTML = h),
				(e.style.background = "#3b82f6"),
				e.setAttribute("aria-label", "Open Askly support chat"),
				e.setAttribute("aria-expanded", "false"),
				q("askly:close"));
		}
		function b() {
			window.removeEventListener("message", m),
				S && clearTimeout(S),
				(S = null),
				t && (t.remove(), (t = null), (n = null)),
				e && (e.remove(), (e = null)),
				(l = !1),
				(d = !1);
		}
		function E(i) {
			b(),
				i.organizationId && (r = i.organizationId),
				i.position && (a = i.position),
				g();
		}
		(window.AsklyWidget = { init: E, show: x, hide: u, destroy: b }), g();
	})();
})();
