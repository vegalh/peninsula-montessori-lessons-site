# Feedback

## Second conversation — September 30, 2026 (day after the Tuesday 9/29 showcase)

About the first version shown at the showcase, my client said: "这个好可爱！后面可以加一些歌曲和书单列表" (this is so cute! later you could add some songs and a book list).

We kept talking about how to make this something she'd actually use every day. She inspired me with the idea of an observation system for teachers that uses Montessori terminology to communicate with parents, so I started a new repository, [rootmapmvp](https://github.com/vegalh/rootmapmvp.git), and rebuilt the whole project there.

While rebuilding it, I pivoted from a teacher-facing tool to a parent-facing app, because the feature Yoyo wanted is hard to do well for 20 children in a classroom but realistic for 1-4, which covers the usual number of kids per family. I redesigned the target customer around that, but kept the core feature: finding activities. I also dropped all wording tied to classroom, lesson, and observation, and made it more inviting for parents.

I then asked one of my mom's cousins in China, who has a two-and-a-half-year-old, to test it and give feedback.

## Later section (see [PRD.md](PRD.md#11-later-ranked-by-client))

For item 1, the observation system: the options laid out were (a) add a teacher-observation module to this site, or (b) start a new parent-facing app in a separate repo — I picked (b) because at a 1:10 teacher-to-child ratio there is zero chance a single teacher can actually record observations for 10 children, while a parent recording for their own 1-4 kids is realistic, so I stopped building it here and moved it to rootmapmvp.

## Change from this conversation

Added a Status note linking this site to rootmapmvp and the ranked PRD Later section: [4aaf365](https://github.com/vegalh/peninsula-montessori-lessons-site/commit/4aaf365).
