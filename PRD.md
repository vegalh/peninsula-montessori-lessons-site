# Product Requirements Document: Peninsula Montessori Lessons Site

## 1. Overview

**Product:** A mobile-friendly website for Peninsula Montessori teachers to quickly find, filter, and manage lessons plans tailored to each child's interests.

**Problem:** Yoyo, a pre-school teacher, doesn't have much time to prepare lessons every day but wants to give each child personalized, engaging lessons. Finding the right lesson plan quickly (ideally with visuals) is the core pain point.

**Goal:** Let teachers filter and search lessons plans in seconds, view rich lesson detail pages (with pictures, materials, and optional media), and save/track the lessons they use.

## 2. Users

- **Yoyo** — Main client and primary user. Pre-school teacher who directly uses the product day-to-day to find and run lessons.
- **Reki** — Oversees the product. Has the **same account access and permissions** as Yoyo (no separate admin role).
- **Future users** — Other teachers in a similar position to Yoyo (time-constrained, want personalized lessons per child).

## 3. Key Action

Filter (and search) lessons plans to quickly find what's needed for a given child/interest.

## 4. Platform

- Website only, used primarily on phones (mobile-responsive), also usable on desktop browsers.
- No native mobile app required.

## 5. Pages & Features

### 5.1 Main Searching Page

- **Free-text search bar** — search by keyword/title (e.g., "water").
- **Filters:**
  - Age range
  - Topic category (e.g., water, animals, plants)
  - Area covered (Practical Life, Sensorial, Math, Language, Music, Art, Culture)
  - Lesson duration / lesson type
- Results should be **picture-forward** — each lesson plan primarily represented by its picture in the list/grid.
- *Note:* Materials required is **not** a filter; it lives on the lesson plan detail page.

### 5.2 Lesson Plan Detail Page

Each lesson plan page should display:

- Title
- Age range
- Area covered
- Topic category
- Lesson duration / lesson type
- Materials required
- Step-by-step instructions
- Pictures
- Optional music/recording upload (attached to the lesson)
- Notes

### 5.3 Account Page

- Name
- Email
- Role (teacher vs. admin field exists, but Yoyo and Reki both have full/equal access regardless of role)
- Profile photo
- Saved lesson plans:
  - **Favorites/bookmarks** for quick access
  - **Usage history** — log of lessons used, with the date(s) used

## 6. Content Management

- Lesson plans (titles, ages, pictures, etc.) are added to the system **another way for now** (not through an in-app "create/edit lesson" form). No content-authoring UI is in scope for this version.

## 7. Style Preferences

- Light color palette.
- Clear, bigger fonts for readability.
- Each lesson plan primarily represented by pictures rather than dense text.
- Support for optional music/recording uploads on lesson pages.

## 8. Inspiration

- **Twinkl** and **Procare** — referenced only for style/UI (simplicity, clean layout), not for their functionality.

## 9. Out of Scope (for now)

- Native mobile app.
- In-app lesson plan creation/editing form.
- Separate admin role/permissions (Yoyo and Reki share the same access).

## 10. Open Questions / Future Considerations

- How will lesson plan content be imported/seeded into the system?
- Will additional teachers beyond Yoyo/Reki need accounts, and if so, will permissions differ then?
