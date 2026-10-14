# Futsal Booking System — Project Requirements

## 1. Project Vision

Build a premium, modern, visually impressive, responsive Futsal Booking
and Management System.

The project should provide two main experiences:

1. A public-facing website where customers can explore courts and book
   available time slots.
2. An administration dashboard where authorized administrators can
   manage bookings, courts, pricing, images, announcements, and settings.

The current priority is FRONTEND DEVELOPMENT and UI/UX DESIGN.

The application should initially work as a complete frontend prototype
using realistic demo data and browser persistence where appropriate.

The architecture should allow a real backend, database, authentication
system, and persistent image storage to be integrated later.

The application must not look like a generic admin template.

It should feel like a polished, commercial sports-booking platform.

## 2. Development Principles

- Inspect the existing project before making changes.
- Follow the requirements in this document.
- Preserve existing working functionality.
- Reuse existing components and dependencies where appropriate.
- Avoid unnecessary rewrites.
- Do not create duplicate pages or duplicate features.
- Do not leave unfinished placeholder pages.
- Do not display buttons that have no meaningful action.
- Use reusable components.
- Keep components maintainable and reasonably small.
- Avoid unnecessary dependencies.
- Use realistic demo data when a backend is unavailable.
- Clearly distinguish demo functionality from real backend functionality.
- Do not claim that simulated operations have been completed in a real database.
- Do not modify generated build files.
- Do not ignore errors merely to make the project compile.
- Run appropriate checks after implementation.

Before major changes, identify the files that need modification and
provide a concise implementation plan.

After planning, implement the changes directly rather than stopping
after describing the solution.

## 3. Design System

Use a premium, modern sports-inspired visual identity.

Preferred visual direction:

- Dark cinematic interface.
- Near-black and charcoal backgrounds.
- Neon-lime green primary accent.
- White headings.
- Muted gray secondary text.
- Subtle gradients.
- Premium sports photography.
- Consistent spacing.
- Rounded cards.
- Subtle borders.
- Professional icons.
- Clean typography.
- Smooth, restrained transitions.

Suggested colors:

- Main background: #080D12
- Sidebar: #0B1118
- Card background: #101820
- Elevated surfaces: #16212B
- Primary accent: #A3FF3F
- Secondary green: #4ADE80
- Primary text: #F8FAFC
- Secondary text: #94A3B8
- Borders: #263442
- Pending status: #FBBF24
- Cancelled status: #F87171
- Maintenance status: #A78BFA

Maintain readable contrast and consistent styling.

Avoid excessive neon glow, unnecessary animations, oversized cards,
large empty spaces, and inconsistent colors.

The public website and admin dashboard should share the same design
language while having layouts appropriate to their purposes.

## 4. Public Website

Create a professional public-facing futsal booking website.

Required sections:

- Navigation bar.
- Hero section.
- Court listings.
- Court details.
- Booking entry point.
- Facilities section.
- How-it-works section.
- Photo gallery.
- Announcements or promotions when configured.
- Contact information when available.
- Footer.

### Hero Section

Use a large, high-quality photograph of a futsal court.

Include:

- Strong headline.
- Short supporting description.
- Book a Court button.
- Explore Courts button.
- Optional date and time search controls.

Use a dark overlay when necessary for readability.

### Court Listings

Each court card should display:

- Court photograph.
- Court name.
- Description.
- Court type.
- Hourly price.
- Availability indicator.
- Relevant configured facilities.
- View Details action.
- Book Now action.

Use real configured information or clearly identified demo data.

### Court Details

Each court should have a dedicated details view with:

- Main photograph.
- Additional gallery images when available.
- Court description.
- Pricing.
- Facilities.
- Operating hours.
- Availability information.
- Booking action.

Do not invent real-world facilities or business information.

## 5. Admin Dashboard

Create a modern administration dashboard.

Use a responsive sidebar and top header.

Suggested navigation:

- Overview.
- Booking Calendar.
- Bookings.
- Courts and Pricing.
- Attendance.
- Reports.
- Announcements.
- Notifications.
- Media and Appearance.
- Settings.

Include only relevant and implemented navigation items.

### Dashboard Summary

Use data-driven summary cards for:

- Today's bookings.
- Upcoming bookings.
- Total courts.
- Available courts.
- Pending bookings.
- Revenue when supported by the data model.

Use realistic demo data only when necessary.

Never present hardcoded demo statistics as verified business data.

### Upcoming Bookings

Display:

- Customer or team name.
- Court.
- Booking date.
- Time.
- Status.
- Relevant actions.

### Recent Activity

Display meaningful prototype events such as new bookings,
booking cancellations, or status changes.

## 6. Booking Calendar

The calendar is one of the most important features.

Requirements:

- Previous-month navigation.
- Next-month navigation.
- Today button.
- Current month and year.
- Date selection.
- Court filters.
- Booking-status filters.
- New Booking action.
- Booking indicators.
- Selected-date details panel.
- Useful empty states.

Calendar cells should display dates clearly and use compact booking
indicators.

Status colors:

- Confirmed: green.
- Pending: amber.
- Cancelled: red or muted gray.
- Maintenance: purple.

Do not use diagonal lines to represent unavailable dates.

Selecting a date should display its bookings and relevant details.

Handle month lengths, weekday alignment, year changes, and leap years
correctly.

On desktop, place the selected-date panel beside the calendar.

On mobile, display the panel below the calendar.

### Daily Court Timeline

Provide a daily availability timeline where practical.

Show courts as rows and time slots as columns.

Make available, booked, and maintenance periods easy to distinguish.

Selecting an available slot should begin the booking process.

For a frontend prototype, availability may be calculated from demo data.

Do not claim real-time availability until a real data source is connected.

## 7. Booking Workflow

Implement a complete, interactive booking workflow.

Suggested steps:

1. Select a court.
2. Select a date.
3. Select an available time slot.
4. Enter customer information.
5. Review the booking.
6. Confirm the booking.
7. Display a confirmation screen.

Show a clear booking summary containing:

- Selected court.
- Date.
- Start time.
- End time or duration.
- Price.
- Customer information.

Validate required fields.

Prevent obvious duplicate submissions.

Display useful validation errors and success or failure messages.

For the prototype, persist suitable demo bookings in browser storage.

Do not describe a simulated booking as a real server-confirmed reservation.

Keep booking logic separate from UI components so it can later connect
to a real API and database.

## 8. Court Management

Create a court management interface.

Administrators should be able to:

- View courts.
- Add a court.
- Edit a court.
- Update pricing.
- Update descriptions.
- Change availability or maintenance status.
- Upload or replace court images.
- Preview court images.
- Remove court images.
- Manage additional gallery images when supported.

Each court must have its own data and image configuration.

Updating one court must not accidentally modify another court.

Changes should update relevant cards and detail views.

Persist prototype changes using an appropriate browser-storage strategy.

## 9. Media and Appearance Management

This is a required feature.

Create an admin page named "Media & Appearance".

The administrator must be able to customize the visual appearance of
the public website without editing source code.

### Branding

Support customization of:

- Futsal logo.
- Business name.
- Primary accent color.
- Main banner.
- Hero image.
- Homepage headline.

### Court Images

Support:

- Uploading images.
- Previewing images.
- Replacing images.
- Removing images.
- Selecting a main image.
- Managing gallery images when supported.

### Website Images

Support customization of:

- Homepage hero.
- About section image.
- Facilities images.
- Promotional banners.
- Gallery images.
- Login background when applicable.

### Customization Workflow

Provide:

- File selection.
- Image preview.
- Save Changes.
- Cancel Changes.
- Reset to Default.
- Success and error feedback.

Use appropriate image aspect ratios and cropping.

Avoid stretched images and broken-image icons.

When the administrator changes an image, update the corresponding
website section and shared components.

The updated image should remain visible after a page refresh within
the limits of the chosen persistence mechanism.

For the frontend prototype, use local browser persistence where
appropriate.

Do not store large image files directly in localStorage without
considering browser storage limits.

Prefer a suitable temporary preview and document the planned persistent
storage integration.

Clearly distinguish local prototype storage from permanent image hosting.

The architecture must allow future integration with a real storage
provider such as Supabase Storage.

## 10. Announcements and Popups

Create an admin page named "Announcements & Popups".

Administrators should be able to:

- Create announcements.
- Edit announcements.
- Delete announcements.
- Enable or disable announcements.
- Preview announcements.
- Configure display periods.
- Configure display frequency.
- Choose supported target audiences.

Each announcement should support:

- Title.
- Message.
- Optional image.
- Announcement category.
- Optional action button.
- Button label.
- Button destination.
- Start date and time.
- End date and time.
- Enabled or disabled status.
- Display frequency.

Supported categories may include:

- General announcement.
- Promotion.
- Temporary closure.
- Maintenance notice.
- Tournament announcement.
- Booking notice.

Supported display styles:

- Centered modal.
- Top announcement banner.
- Non-blocking notification.

### Popup Behavior

- Disabled announcements must not appear.
- Expired announcements must not appear.
- Future announcements must not appear before their start time.
- Dismissed announcements should not repeatedly reopen during
  ordinary navigation.
- Popups must have a visible close button.
- Popups must be usable on mobile.
- Announcement images must have suitable fallbacks.
- Do not display the same announcement multiple times because
  components rerender.

Use sensible dismissal and display-frequency defaults.

The initial prototype may store announcements in browser storage.

Keep announcement data and rendering logic separate so the feature
can later use a backend and database.

## 11. Notifications

Create a notification center.

Include:

- Notification icon in the dashboard header.
- Unread notification badge.
- Notification dropdown.
- Dedicated notification history page.
- Mark as read.
- Mark all as read.
- View notification details.
- Navigation to the related page when appropriate.

Support prototype events such as:

- New booking.
- Booking cancellation.
- Booking awaiting confirmation.
- Court maintenance.
- New announcement.
- Customer message when messaging is supported.

Create notification preferences so the administrator can enable or
disable supported notification categories.

Distinguish between:

1. In-app notifications.
2. Popup announcements.
3. Browser notifications.
4. Email notifications.
5. SMS notifications.

The frontend prototype may simulate notification events.

Do not claim that actual email or SMS messages are being delivered
without a functioning backend integration.

Browser notifications must respect browser permission requirements.

## 12. Booking Management

Create a professional bookings page with:

- Search.
- Date filters.
- Court filters.
- Status filters.
- Booking type.
- Customer information.
- Time and duration.
- Price.
- Payment status when supported.

Provide relevant actions:

- View booking.
- Edit booking.
- Cancel booking.
- Update status.

Use tables on desktop and compact cards on mobile where appropriate.

Add confirmation dialogs for destructive actions.

Update the calendar and dashboard when bookings change.

## 13. Attendance

Create an attendance page where appropriate.

Display:

- Booking date.
- Customer or team.
- Court.
- Scheduled time.
- Attendance status.
- Check-in time when supported.

Use clear status indicators.

Provide functional interactions and appropriate empty states.

## 14. Reports

If reports are included in the prototype, use data-driven charts for:

- Booking trends.
- Court utilization.
- Booking-status breakdown.
- Revenue when payment data is available.

Use real or clearly identified demo data.

Do not display misleading statistics.

## 15. Design System and Reusable Components

Create reusable components as appropriate:

- AppSidebar.
- AppHeader.
- PageHeader.
- StatCard.
- CourtCard.
- BookingCard.
- BookingCalendar.
- DailyCourtTimeline.
- BookingStatusBadge.
- ImageUploadField.
- ImagePreview.
- AnnouncementModal.
- AnnouncementBanner.
- NotificationDropdown.
- NotificationItem.
- ConfirmDialog.
- Toast.
- EmptyState.
- LoadingState.
- ErrorState.

Use the project's existing component library when practical.

Avoid unnecessary duplication and overly large components.

## 16. Responsive Design

The entire application must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

The public website must provide an excellent mobile booking experience.

The admin dashboard should remain usable on small screens.

Requirements:

- Responsive navigation.
- Mobile-friendly calendar.
- Touch-friendly buttons.
- Responsive court cards.
- Mobile-friendly forms.
- Dialogs that fit the screen.
- No unwanted horizontal overflow.
- Correct image cropping.
- Readable typography.

Do not simply shrink the desktop interface.

## 17. Accessibility

Follow accessibility best practices.

Include:

- Semantic HTML.
- Accessible labels.
- Keyboard navigation.
- Visible focus indicators.
- Sufficient contrast.
- Accessible modal behavior.
- Reduced-motion support.
- Text labels for booking statuses.
- Proper button types.

Do not rely on color alone to communicate important information.

## 18. Frontend Architecture

Inspect the existing framework and dependencies.

If the project is empty, prefer:

- Next.js.
- TypeScript.
- Tailwind CSS.
- Lucide React.
- Reusable React components.

Use compatible versions.

Avoid unnecessary dependencies.

Separate:

- UI components.
- Page layouts.
- Types.
- Demo data.
- Booking logic.
- Browser persistence.
- Image management.
- Announcement management.
- Notification management.

Do not hardcode large datasets directly into page components.

Keep the data layer replaceable so real APIs and a database can be
integrated later.

## 19. Prototype Data and Persistence

The initial project is primarily frontend-focused.

Use realistic demo data for the initial experience.

Clearly label prototype data in development where appropriate.

Persist relevant user changes in browser storage where suitable.

Examples include:

- Court information.
- Court image references or previews.
- Branding settings.
- Appearance settings.
- Announcements.
- Notification read status.
- Prototype bookings.

Handle browser-storage errors gracefully.

Avoid storing sensitive information in browser storage.

Do not confuse local persistence with multi-user database persistence.

Organize data access behind replaceable services or repositories.

## 20. Quality Assurance

After implementing changes:

- Inspect all pages.
- Verify navigation.
- Verify forms.
- Verify booking interactions.
- Verify calendar navigation.
- Verify image replacement.
- Verify appearance customization.
- Verify announcement scheduling.
- Verify popup dismissal.
- Verify notification interactions.
- Verify browser persistence.
- Verify responsive layouts.
- Check for broken images.
- Check for console errors.
- Run TypeScript checks if applicable.
- Run the project's existing tests.
- Run the production build.

Fix errors introduced by the implementation.

Do not modify generated build files.

Do not claim tests passed unless they were actually executed.

## 21. Implementation Priority

Implement the project in the following order:

Priority 1:
- Design system.
- Public homepage.
- Sports photography.
- Responsive navigation.

Priority 2:
- Court listing.
- Court details.
- Booking workflow.

Priority 3:
- Admin layout.
- Dashboard.
- Booking calendar.
- Daily court timeline.

Priority 4:
- Court management.
- Pricing management.
- Media and Appearance.

Priority 5:
- Announcements and Popups.
- Notification center.
- Notification preferences.

Priority 6:
- Attendance.
- Reports.
- Settings.

Priority 7:
- Responsive refinements.
- Accessibility.
- Testing.
- Final visual polish.

If time or context is limited, complete and polish the most important
user journeys before adding secondary features.

## 22. Definition of Done

The project is not complete merely because the pages exist.

The project is considered ready for frontend demonstration when:

- The public website looks professional and visually rich.
- High-quality sports photography is integrated.
- Court cards and details are visually consistent.
- The booking flow works interactively.
- The admin dashboard is visually polished.
- The calendar navigation works.
- Court management interactions work.
- Administrators can change image previews and branding.
- Announcements can be created, previewed, enabled, and disabled.
- Popup scheduling and dismissal behave correctly.
- Notifications can be viewed and marked as read.
- Relevant changes persist using the chosen prototype storage.
- Mobile layouts work correctly.
- Navigation links work.
- There are no obvious broken images or nonfunctional controls.
- The project builds successfully, or any pre-existing blockers
  are clearly identified.

FINAL PRINCIPLE:

Build a complete, coherent, premium futsal booking frontend.

Prioritize visual quality, real interactions, useful booking workflows,
admin customization, sports photography, and maintainable architecture.

Do not stop after creating a plan.
Inspect, implement, test, and refine the actual project.