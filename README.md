# BookFinder

A React application for searching books via the [Open Library API](https://openlibrary.org/developers/api). Users can search by title, browse paginated results (books with covers only), open a detail page, and revisit recently viewed books.

## Features

- **Search by title** — find books on the home page with a search bar
- **Cover-only results** — only books with a cover image are shown in the grid
- **Pagination** — 8 books per page with shareable URL state (`?q=` and `?page=`)
- **Book details** — cover, authors, description, ISBN, and publisher
- **Previously viewed** — books you opened are listed on the home page (persisted in `localStorage`)
- **Loading skeletons** — placeholder UI while search and details load
- **Accessible UI** — labeled search field, pagination landmarks, descriptive link labels, focus rings
- **Error handling** — inline messages on failed search or book load (no duplicate toasts)
- **Prefetching** — hover/focus on book cards and pagination; next search page prefetched after each load
- **Perceived performance** — skeleton grids, top progress bar, instant detail paint from list preview state

## Assignment mapping

| Requirement | Implementation |
|-------------|----------------|
| Landing page with search by title | `pages/Home.tsx` + `components/Search.tsx` |
| Search results below the bar | `components/Results.tsx` |
| Previously viewed on the same page | `components/PreviouslyViewed.tsx` + `context/PreviouslyViewedProvider.tsx` |
| Book details page | `pages/BookDetails.tsx` at `/books/:id` |
| Cover, author, publisher, ISBN, description | `useBookDetails` + Open Library works / editions / authors APIs |
| Only books with covers in results | `buildCoverSearchQuery()` in `api/openLibrary.ts` |
| React + TypeScript + CSS framework | React 19, TypeScript, Tailwind CSS |

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — dev server and build
- [React Router](https://reactrouter.com/) — client-side routing
- [TanStack Query](https://tanstack.com/query) — search and book detail fetching
- [Tailwind CSS](https://tailwindcss.com/) — styling

## Getting started

### Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

```bash
npm run build    # production build (TypeScript + Vite)
npm run preview  # preview production build locally
npm run lint     # ESLint
```

## Usage

1. Enter a book title and press **Search** or Enter.
2. Browse results and use pagination to see more pages.
3. Click a book to open its detail page.
4. Use **Clear** to reset the search and results.
5. Previously viewed books appear at the bottom of the home page.

Example URL with search and page:

```text
http://localhost:5173/?q=harry&page=2
```

## Open Library API

| Purpose | Endpoint |
|--------|----------|
| Search (title + cover filter) | `GET /search.json?q=title:… AND cover_i:[1 TO *]` |
| Work details | `GET /works/{id}.json` |
| Editions (ISBN, publisher) | `GET /works/{id}/editions.json` |
| Author name | `GET /authors/{id}.json` |
| Cover image | `GET https://covers.openlibrary.org/b/id/{cover_i}-L.jpg` |

Search uses Solr-style queries so `numFound` reflects only works with covers, keeping pagination consistent (8 books per page).

## Project structure

```text
src/
├── api/              # Open Library fetch helpers
├── components/       # UI (search, results, pagination, skeletons, etc.)
├── constants/        # API base URLs
├── context/          # Previously viewed provider + context
├── hooks/            # React Query hooks and context hook
├── lib/              # Query client, HTTP errors
├── pages/            # Home and BookDetails routes
├── types/            # TypeScript interfaces
└── utils/            # localStorage helpers
```

## Design notes

- **Covers only** — the search query includes `cover_i:[1 TO *]` so the API does not return works without cover metadata. This avoids empty cards and uneven page sizes.
- **URL as source of truth** — `q` and `page` live in query params so searches and pages are bookmarkable and work with the back button. The search input remounts when `q` changes (`key={q}`), avoiding extra sync effects.
- **React Query** — caches search pages and book details for 5 minutes; pagination uses `keepPreviousData` so results stay visible while the next page loads.
- **ISBN and publisher** — loaded from the first edition returned by the editions endpoint, not from the work record alone.
- **Previously viewed** — recorded when a detail page loads successfully and the work has a cover; stored in context and `localStorage` (max 10 items).
- **Errors** — surfaced inline on the page that failed (search or details), without redundant toast notifications.
- **Detail fetch** — work loads first, then authors + editions in parallel (`Promise.all`). Prefetch on card hover fills React Query cache before navigation.
- **Preview state** — list links pass `location.state.preview` so cover, title, and authors render immediately; metadata panel skeleton fills in after fetch.
- **Search pagination** — `keepPreviousData` keeps the grid visible; `TopProgress` + prefetch of page `n+1` and hover targets make page changes feel instant when cached.

## License

This project is for educational / interview purposes. Data provided by [Open Library](https://openlibrary.org/).
