# Notion-like Note-Taking App

A full-stack Notion-inspired note-taking application with a block-based editor, nested pages, JWT authentication, and MongoDB persistence.

## Project Structure

```
notion/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Block.js
│   │   ├── Page.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── blocks.js
│   │   └── pages.js
│   ├── validation/
│   │   ├── auth.js
│   │   └── pages.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BlockRenderer.jsx
│   │   │   ├── Editor.jsx
│   │   │   ├── PageTree.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── icons.jsx
│   │   ├── hooks/
│   │   │   └── useAutoSave.js
│   │   ├── lib/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000` by default.

## Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173` by default.

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017
MONGO_DB=notion
JWT_SECRET=supersecret
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Pages
- `GET /pages` (supports `?q=` for searching title/content)
- `POST /pages`
- `GET /pages/:id`
- `PUT /pages/:id`
- `DELETE /pages/:id` (soft delete)

### Blocks
- `GET /blocks/:pageId`
- `PUT /blocks/:pageId` (bulk save)

## MongoDB Schema Examples

### users collection
```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "passwordHash": "...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### pages collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "Meeting Notes",
  "parentId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### blocks collection
```json
{
  "_id": "ObjectId",
  "pageId": "ObjectId",
  "type": "heading",
  "content": { "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "Title" }] },
  "order": 0
}
```

## Feature Highlights

- JWT-based authentication with register/login endpoints.
- Nested pages in a sidebar tree view.
- Block-based editor powered by Tiptap, including slash commands and autosave.
- Search by title or content using the `q` query param.
- Soft delete for pages (trash) and block storage per page.

## Notes

- Store the JWT from auth responses in `localStorage` as `token` (the frontend does this automatically when using `register` or `login` from `api.js`).
- The editor autosaves blocks to MongoDB with a debounce for smooth typing.
