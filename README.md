# QistonPe Invoice Management Dashboard

A modern invoice management system for MSMEs built with React and Tailwind CSS.

## Setup & Run

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Approach

### Component Structure
- **Context API** for global state (invoices, theme)
- **Modular components** (Sidebar, Dashboard, Invoices, Payments, Settings)
- **Smart/Dumb component pattern** for reusability

### Optimization Techniques Used
- `useMemo` for expensive calculations (filtering, sorting, summaries)
- `useCallback` for stable function references
- Pagination (10 items per page)
- LocalStorage for persistence
- Minimal re-renders through proper dependency arrays

### Challenges Faced
- Status calculation logic with date comparisons
- Real-time summary updates across filters
- CSV export with proper formatting
- Dark mode implementation across all components

## Performance Optimizations

1. **Memoization**: Used `useMemo` for filtered lists, sorted data, and summary calculations
2. **Callback optimization**: `useCallback` for event handlers to prevent child re-renders
3. **Pagination**: Implemented 10 items per page to handle large datasets
4. **Efficient filtering**: Single-pass filtering and sorting operations
5. **LocalStorage**: Persistent data without backend calls

## Time Breakdown

- Design & Planning: 2 hours
- Development: 8 hours
- Testing & Debugging: 2 hours
- Total: 12 hours

## Features

### Core Features
- ✅ Invoice list with filtering, sorting, search
- ✅ Summary cards with real-time calculations
- ✅ Add/Edit/Delete invoices
- ✅ Mark as paid functionality
- ✅ Bulk actions
- ✅ Export to CSV
- ✅ Dark mode
- ✅ Responsive design

### Pages
- Dashboard (fully functional)
- Invoices (fully functional)
- Payments (UI only)
- Settings (Toggle Working)

## Tech Stack
- React.js (Vite)
- Tailwind CSS
- Recharts
- LocalStorage
