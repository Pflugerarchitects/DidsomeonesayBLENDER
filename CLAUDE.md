# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Vizzy is a production-ready full-stack architecture visualization app for managing and viewing multi-project image galleries. Built with React 19 + Vite + Tailwind CSS v4 on the frontend, and PHP 7.4+ + MySQL on the backend. Deployed on Bluehost shared hosting.

**Production:** https://vizzy.pflugerarchitects.com

## Project Naming Convention

Projects follow a structured naming format: `CITY-TYPE-NUMBER-projectname`

**City Codes:**
- DAL - Dallas
- AUS - Austin
- HOU - Houston
- SA - San Antonio
- CC - Corpus Christi

**Project Types:**
- ES - Elementary School
- MS - Middle School
- HS - High School
- HE - Higher Education
- BP - Bond Proposal
- UQ - Unique

**Project Number Format:** XX-XXX (e.g., 12-345)

**Example:** `AUS-HS-24-156-Georgetown` (Austin High School, project 24-156, named "Georgetown")

**Display Behavior:**
- Internal storage: Full name with prefix (e.g., `AUS-HS-24-156-Georgetown`)
- UI Display (Header): Project number + name (e.g., `24-156-Georgetown`)
- UI Display (Sidebar): Project number + name (e.g., `24-156-Georgetown`)
- Editing: Users edit only the name part; prefix and number are preserved automatically
- Filtering: City and Type are extracted from the prefix for multi-select filters
- Legacy Support: Old format `CITY-TYPE-name` still supported for backward compatibility

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build (outputs to /build/)
npm run preview      # Preview production build locally
```

**Environment Setup:**
Create `.env` file with:
```
VITE_API_URL=https://vizzy.pflugerarchitects.com/api
```

## Architecture

### Frontend Architecture (React)
- **State Management:** React hooks (useState, useEffect) in App.jsx with props drilling
- **Context Providers:** AuthContext for authentication, ThemeProvider for light/dark mode
- **Data Flow:** App.jsx manages all project/image state, passes down via props to components
- **API Communication:** Centralized in src/utils/api.js with projectsAPI, imagesAPI, storageAPI
- **localStorage Usage:** Persists active project ID and theme preference across sessions

### Backend Architecture (PHP)
- **REST API:** All endpoints in backend/api/ directory (projects.php, images.php, upload.php, storage.php)
- **Database Layer:** PDO with prepared statements in backend/db.php
- **Shared Utilities:** CORS headers, validation, error handling in backend/utils.php
- **File Storage:** Images stored in /uploads/images/{project_id}/ on filesystem

### Database Schema
- **vizzy_projects:** id, name, created_date, updated_date, display_order
- **vizzy_images:** id, project_id, filename, file_path, upload_date, file_size, mime_type, display_order
- **Database Name:** pflugera_projectvizzy_db (shared with ProjectPrism app)

### Key Components

**App.jsx** (Main orchestrator)
- Manages all projects and images state
- Handles CRUD operations via API calls
- Controls active project selection and sidebar collapse state
- Coordinates storage tracking (10GB limit)
- Implements `getFullDisplayName()` utility to extract number + name from CITY-TYPE-NUMBER-name format
- Manages CitySelectionModal state for four-step project creation
- Header layout:
  - Left (Vizzy logo)
  - Center (Project title with Apple-inspired typography - 42px SF Pro Display, font-weight 600, -0.02em letter spacing)
  - Right (Frameless icon buttons: Upload, Logout, Theme)
- Header styling: Title positioned 92px down from center, generous spacing (32px gap for future elements)

**Sidebar.jsx & ProjectList.jsx**
- Floating sidebar with rounded corners, shadow, and minimal design
- **Search Bar:** Full-text search above filters with clear button
- **Collapsible Filters:** Click header with chevron to expand/collapse filter bubbles
  - Active filter count badge shows total selected filters
  - Clear all button appears when filters are active
- Multi-select bubble filters for City and Project Type (OR within category, AND between categories)
  - Pill-shaped buttons (20px border-radius) with subtle borders
  - Hover: scale(1.1) animation with background highlight and blue border
  - Active: Blue background with white text and shadow glow
- Drag-and-drop project reordering (display_order field)
- Double-click to rename projects (shows CITY-TYPE-NUMBER- prefix as read-only, edits name only)
- Delete button (prevents deleting last project)
- Storage progress bar with color coding (green < 75%, orange < 90%, red >= 90%)
- Projects display number + name without CITY-TYPE prefix (e.g., "24-156-Georgetown")

**CitySelectionModal.jsx** (Four-step project creation)
- Step 1: City selection (grid of city buttons with abbreviations)
- Step 2: Project type selection (grid of type buttons)
- Step 3: Project number input (XX-XXX format with auto-dash formatting and validation)
- Step 4: Project name input (shows non-editable CITY-TYPE-NUMBER- prefix)
- Modal renders at App level for proper screen centering
- Supports back navigation between steps and ESC key to cancel

**ImageUpload.jsx**
- Uses react-dropzone for drag-and-drop file selection
- Multi-file upload support (JPG, PNG, WebP, GIF)
- 20MB per file limit
- Progress tracking and error handling
- Compact mode: 40x40px icon button for header (uses `.header-icon-button` class)
- Full mode: Drag-and-drop area with upload icon and text

**ImageGallery.jsx & LazyImage.jsx**
- Responsive grid layout (2-4 columns based on viewport)
- Generous top spacing (168px padding) for visual breathing room
- Lazy loading with Intersection Observer API
- Click to open full-size in new window (dual-monitor workflow)
- Download and delete actions per image
- Phase assignment dropdown on each image (SD, DD, Final, Approved) via hover footer
- Phase badges display on images when assigned (colored badges in top-left corner)
- Performance optimizations:
  - CSS `contain: layout style paint` on gallery items for layout isolation
  - React.memo() on both ImageGallery and LazyImage components
  - Specific property transitions instead of `transition: all`
  - GPU acceleration via `transform: translateZ(0)`
  - Removed expensive backdrop-filter effects

**ThemeToggle.jsx & ThemeProvider.jsx**
- Light/dark mode toggle as 40x40px icon button (Sun/Moon icon)
- Shows only relevant icon (Moon in light mode, Sun in dark mode)
- Uses `.header-icon-button` class for consistent header styling
- Persists preference to localStorage via ThemeProvider
- Auto-detects system preference on first load
- Uses CSS custom properties for theme variables

**AuthContext.jsx**
- Hardcoded credentials: apps@pflugerarchitects.com / 123456
- Client-side only authentication (no backend sessions)
- **NOT secure for public deployment**

## Important: Tailwind CSS v4

This project uses **Tailwind CSS v4** which has different configuration than v3. DO NOT modify these without updating Tailwind version:

**postcss.config.js:**
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},  // NOT 'tailwindcss'
    autoprefixer: {},
  },
}
```

**src/index.css:**
```css
@import "tailwindcss";  // NOT @tailwind directives
```

## API Endpoints

All endpoints are in backend/api/ and follow RESTful conventions:

**Projects:**
- `GET /api/projects.php` - Fetch all projects with image counts
- `POST /api/projects.php` - Create new project (body: {name})
- `PUT /api/projects.php` - Update project (body: {id, name?, display_order?})
- `DELETE /api/projects.php` - Delete project and all its images (body: {id})

**Images:**
- `GET /api/images.php?project_id=X` - Fetch project images
- `DELETE /api/images.php` - Delete image and file (body: {id})

**Upload:**
- `POST /api/upload.php` - Upload images (multipart/form-data: project_id, files[])

**Storage:**
- `GET /api/storage.php` - Get total storage usage (total_bytes, total_images)

## UI Design Patterns

### Header Icon Buttons
All header action buttons (Upload, Logout, Theme) use consistent styling via `.header-icon-button` class:
- Size: 40x40px
- Background: Transparent (frameless design)
- Icon size: 20px
- Hover: scale(1.1) zoom effect with subtle background
- Consistent spacing: 0.75rem gap
- Minimal, clean appearance matching Apple design language

### Modal Centering
Modals (CitySelectionModal, DeleteConfirmationModal) render at App root level (not within sidebar):
- Full-screen overlay with `position: fixed`
- Flexbox centering: `align-items: center; justify-content: center`
- Backdrop blur: 4px
- Slide-up animation on open

### Floating Sidebar
- Positioned absolutely within `.app-body`
- Inset spacing: `var(--spacing-md)` on all sides
- Border-radius: `var(--radius-xl)` with `overflow: hidden`
- Box shadow: `0 4px 12px rgba(0, 0, 0, 0.08)`
- Collapse transition: 0.2s cubic-bezier easing on width only
- Collapsed width: 60px, Expanded width: 280px

### Multi-Select Filters (Sidebar)
- **Search functionality:** Real-time project name search with clear button
- **Collapsible UI:** Click "Filters" header with chevron to toggle visibility
- **Filter bubbles:** Pill-shaped buttons (20px border-radius) with abbreviations
  - Default: Subtle background with 1px border
  - Hover: scale(1.1) animation + blue border + background highlight
  - Active: Blue background (`var(--accent-blue)`) + white text + shadow glow
- **Filtering logic:** OR within category (multiple cities), AND between categories (city AND type)
- **Clear controls:**
  - Individual search clear (X button)
  - Clear all filters button (appears when any filter active)
- **Active indicator:** Badge showing count of active filters

## Common Patterns

### Adding a New Component
1. Create component in src/components/
2. Import and use in App.jsx or parent component
3. Pass required props from App.jsx state
4. Use useTheme() hook for theme-aware styling

### Adding a New API Endpoint
1. Create PHP file in backend/api/
2. Include utils.php for CORS and validation helpers
3. Include db.php for database connection
4. Add corresponding function in src/utils/api.js
5. Use the API function in App.jsx or component

### State Updates Pattern
When modifying projects/images:
1. Call API function (projectsAPI.update(), imagesAPI.delete(), etc.)
2. Update local state optimistically or after API success
3. Refresh storage usage if file sizes changed (loadStorageUsage())
4. Handle errors with try/catch and user-friendly alerts

### Image Upload Flow
1. User drops files in ImageUpload component (header button or full drop zone)
2. Component calls imagesAPI.upload(projectId, files)
3. Backend upload.php validates, saves files, creates DB records
4. Returns success/error array for each file
5. ImageUpload calls onImagesAdded callback
6. App.jsx reloads project images and storage usage

### Project Creation Flow
1. User clicks "New Project" button in sidebar
2. App.jsx shows CitySelectionModal (Step 1: City selection)
3. User selects city → Modal advances to Step 2 (Project type)
4. User selects type → Modal advances to Step 3 (Project number input)
5. User enters project number (XX-XXX format, auto-formats dash) → Modal advances to Step 4
6. User enters name with CITY-TYPE-NUMBER- prefix shown as read-only
7. On submit: App.jsx calls `projectsAPI.create(fullName)` with format `CITY-TYPE-NUMBER-name`
8. New project added to state and set as active

### Display Name Extraction
Use `getFullDisplayName(projectName)` utility to show project number + name:
```javascript
const getFullDisplayName = (projectName) => {
  const parts = projectName.split('-');
  if (parts.length >= 4) {
    // New format: CITY-TYPE-NUMBER-name (return NUMBER-name)
    return parts.slice(2).join('-');
  } else if (parts.length >= 3) {
    // Legacy format: CITY-TYPE-name (return name only)
    return parts.slice(2).join('-');
  }
  return projectName; // Fallback
};
```
Applied in: Header title (42px Apple typography), Sidebar project list, Project editing

For editing, use separate function to extract just the name part while preserving CITY-TYPE-NUMBER prefix.

## Production Deployment

App is deployed on Bluehost at https://vizzy.pflugerarchitects.com

**Deployment Structure:**
```
/public_html/vizzy/
├── index.html              # Frontend build output
├── assets/                 # JS/CSS bundles
├── backend/
│   ├── api/                # PHP API endpoints
│   ├── config.php          # DB credentials (NOT in git)
│   ├── db.php              # Database connection
│   └── utils.php           # CORS, validation
└── uploads/
    └── images/             # User-uploaded files
        └── {project_id}/
```

**See `DEPLOYMENT-BLUEHOST-SHARED.md` for detailed deployment instructions.**

## Security Features

- SQL injection protection via PDO prepared statements
- File upload validation (type, size, MIME type)
- CORS headers configured for production domain
- Upload directory protected from PHP execution (.htaccess)
- config.php with DB credentials excluded from git (.gitignore)

**Security Limitations:**
- Hardcoded client-side authentication (not production-safe)
- No backend sessions or JWT tokens
- 10GB storage limit is UI-only (not enforced server-side)

## Performance Optimizations

**Sidebar Collapse Animation:**
- Transition only `width` property (not `all`) for better performance
- GPU acceleration: `transform: translateZ(0)` on sidebar and main content
- Cubic-bezier easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Reduced transition time: 0.2s (was 0.3s)

**Image Gallery Rendering:**
- CSS containment: `contain: layout style paint` on each gallery item
- React.memo() wrapping ImageGallery and LazyImage components
- Specific property transitions (transform, border-color, box-shadow) instead of `all`
- Removed `will-change` overuse and expensive `backdrop-filter: blur()`
- Grid layout optimized with `transform: translateZ(0)` on container

**General Optimizations:**
- Lazy loading images with Intersection Observer (100px rootMargin)
- Memoized filter logic in Sidebar with useMemo
- Debounced rename operations
- Optimistic UI updates before API confirmation

## Known Issues & Limitations

1. **Authentication:** Hardcoded credentials in AuthContext.jsx - client-side only
2. **Storage Limit:** 10GB limit is UI-only display, not enforced by backend
3. **No Image Optimization:** Images stored at full resolution, no thumbnails or compression
4. **Project Name Format:** Projects must follow CITY-TYPE-name format; legacy projects without format may display incorrectly
5. **No Batch Operations:** Must delete images one at a time
6. **No User Management:** Single shared login for all users

## Troubleshooting

**"Failed to load projects" on dev server:**
- Check .env has correct VITE_API_URL
- Verify backend API is accessible (CORS configured)
- Check browser console for detailed error

**Images not uploading:**
- Verify uploads/images/ folder exists with 755 permissions
- Check file size (max 20MB per file)
- Ensure file format is JPG/PNG/WebP/GIF
- Check PHP upload limits (upload_max_filesize, post_max_size)

**Images not displaying:**
- Check browser network tab for image URL errors
- Verify files exist in /uploads/images/{project_id}/
- Check database file_path column has correct paths
- Confirm getImageUrl() in api.js constructs correct URLs

**Drag-and-drop not working:**
- Check react-dropzone is installed (npm install)
- Verify browser supports File API
- Check console for JavaScript errors

---

## Recent UI/UX Updates (2025-01-20)

### Apple-Inspired Design Language
- **Header Title Typography:**
  - Font: SF Pro Display (Apple system font stack)
  - Size: 42px (large, prominent)
  - Weight: 600 (semibold)
  - Letter spacing: -0.02em (tight, Apple-style)
  - Line height: 1.1
  - Positioning: 92px down from center for visual balance

- **Spacing Philosophy:**
  - Generous whitespace throughout
  - Image gallery: 168px top padding for breathing room
  - Header title gap: 32px for future expansion
  - Consistent use of scale(1.1) hover animations

- **Icon Button Design:**
  - Frameless, transparent backgrounds
  - scale(1.1) hover zoom effect
  - Subtle background on hover only
  - Minimal, clean appearance

- **Filter Bubble Interactions:**
  - Pill shape with 20px border-radius
  - scale(1.1) hover animation
  - Blue active state with shadow glow
  - Consistent across sidebar and removed phase filters

### Sidebar Enhancements
- **Search Bar:** Added full-text project search above filters
- **Collapsible Filters:** Click to expand/collapse with chevron icon
- **Active Filter Badge:** Shows count of selected filters
- **Clear All:** One-click to reset all filters and search

### Removed Features
- **Phase Filters (Header):** Removed from header after testing - phase assignment still available on individual images via dropdown

### Database Schema Updates
- **vizzy_images table:** Added `phase` column (VARCHAR(20), nullable)
  - Valid values: 'SD', 'DD', 'Final', 'Approved', NULL
  - Indexed for filtering performance
  - Migration: `backend/migrations/add_image_phase.sql`

---

**Last Updated:** 2025-01-20 (Major UI refresh with Apple design language, search, and collapsible filters)
