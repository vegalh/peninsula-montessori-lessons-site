# peninsula-montessori-lessons-site

A website for quickly finding and filtering circle-time lesson plans based on each child's interests and preferences, so teachers can give as much personalized learning as possible with minimal prep time.

**Client:** Yoyo (main user) and Reki, teachers at Peninsula Montessori — see [PROPOSAL.md](PROPOSAL.md) for the full client brief.

**Live site:** https://vegalh.github.io/peninsula-montessori-lessons-site/

## Who opens this, and what do they need in the first five seconds?

Yoyo, a pre-school teacher who doesn't have much time to prepare lessons, opens this mid-prep needing to immediately filter down to a lesson plan that fits what a specific child is interested in — the search bar plus age/topic/area filters on the main page exist to answer that in the first five seconds: [ccf16ee](https://github.com/vegalh/peninsula-montessori-lessons-site/commit/ccf16ee6920e1333a74b10297ac7f5bca485f473).

## What's a piece of AI output you didn't accept as-is?

The first build of the Discover/main page didn't match my chathelpdraw sketch, wasn't mobile-appropriate, and its filters/search bar were fake — buttons just toggled their own color with no logic tied to the lesson cards. It also nested the save/heart `<button>` inside each card's `<a>`, so clicking it navigated to the lesson instead of saving it. I rejected that pass and asked for a working, phone-appropriate rebuild. The AI rebuilt it with real `data-*`-attribute filtering and the save button moved to sit as a sibling of the link instead of nested inside it — both now documented as conventions in [AGENTS.md](AGENTS.md) so future changes don't repeat the bug — and the fix shipped in [ccf16ee](https://github.com/vegalh/peninsula-montessori-lessons-site/commit/ccf16ee6920e1333a74b10297ac7f5bca485f473).

## Status

Active development has moved to [rootmapmvp](https://github.com/vegalh/rootmapmvp), a parent-facing rebuild of this concept. See [FEEDBACK.md](FEEDBACK.md) for why.
