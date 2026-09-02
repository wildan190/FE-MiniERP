# Table Design Standard & Responsive Mobile Accordion Rule

This rule defines the standardized UI/UX design conventions for data tables across all MiniERP modules.

---

## 1. Desktop View Standard (`md:` and larger screens)

1. **Table Container (`Card`)**:
   - Wrap tables in a `<Card>` component or `.table-container` wrapper with `overflow-x-auto`.
   - Prevent background cutoff or double scrollbars.

2. **Table Header (`<thead>`)**:
   - Background: `bg-gray-50/75` or `bg-gray-50`.
   - Header Cells (`<th>`):
     - Classes: `px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider` (or `text-center` for index/action columns).
     - Border: `border-b border-gray-200/80`.

3. **Table Body (`<tbody>`)**:
   - Rows (`<tr>`):
     - Hover effect: `hover:bg-gray-50/80 transition-colors`.
     - Border: `border-b border-gray-100 last:border-b-0` or `divide-y divide-gray-100`.
   - Cells (`<td>`):
     - Padding: `px-6 py-4 whitespace-nowrap` (or truncated as needed).

4. **Index / Numbering Column**:
   - Font: `font-mono text-xs font-bold text-gray-400`.

5. **Status Badges**:
   - Use rounded pill badges with indicator dots (`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full`).

6. **Action Toolbar**:
   - Group action buttons in an inline toolbar (`inline-flex items-center bg-gray-50/80 border border-gray-200/80 rounded-xl p-1 gap-1 shadow-sm`).

---

## 2. Mobile View Standard (`<md` screens)

1. **Mandatory Expand/Collapse Accordion Pattern**:
   - Do NOT render squeezed HTML `<table>` elements on mobile.
   - Use expandable/collapsible card rows (`MobileExpandableRow.vue` or accordion card pattern).

2. **Card Structure**:
   - **Header Bar (Always visible)**:
     - Left side: Avatar/Icon badge + Primary title/identifier + Status badge.
     - Right side: Quick metric/action + Interactive Chevron button (`ChevronDown` when collapsed, `ChevronUp` when expanded).
   - **Expanded Content (Toggle on click)**:
     - Detailed metadata grid (dates, descriptions, departments, codes, etc.).
     - Complete Action Toolbar (Edit, Delete, View, Status updates).

3. **Animation & Transition**:
   - Smooth height/opacity transition for expanding details to provide feedback on mobile touch interaction.
