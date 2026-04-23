# askly

multilingual ai chat for campus communication. students ask questions in hindi, english, or regional languages — get instant answers from your docs.

[![license: gpl v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![ask deepwiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/senutpal/askly)

## what it does

- answers student queries 24/7 in their language
- pulls answers from your pdfs and circulars (rag)
- voice calls via vapi
- embeddable widget (one script tag)
- real-time analytics dashboard

## stack

- next.js 15 + react 19
- convex (backend/db)
- clerk (auth)
- openai / gemini / claude
- turborepo monorepo

## setup

```bash
git clone https://github.com/senutpal/askly.git
cd askly
pnpm install
pnpm dev
```

needs node 20+, pnpm 10.4+

create `.env.local` files in each app with your keys (clerk, convex, vapi, gemini).

## embed

```html
<script
  src="https://your-domain.com/widget.js"
  data-organization-id="org_xxx"
></script>
```

## structure

```
apps/
  web/      # dashboard
  widget/   # chat ui
  embed/    # script loader
packages/
  backend/  # convex functions
  ui/       # shared components
```

## license

gpl-3.0
