

## Report-Driven Appointment Booking Workflow

This plan transforms the existing scan report feature into an IRCTC-style booking pipeline: Upload → Scan → Match Doctors → Select → Login (if needed) → Fill Details → Confirm.

### Architecture Overview

```text
Upload Report → OCR Analysis → Keyword-to-Specialization Mapping
    → Filter hospitals[] dataset → Display matched doctors
    → User selects doctor → "Book Appointment"
    → Auth check (redirect to /auth if needed, preserve state)
    → Patient Details Form (pre-filled from OCR)
    → Confirmation Screen
```

### Key Components & Files

**1. Booking Context (`src/contexts/BookingContext.tsx`)** — New
- React context to hold booking state across the entire flow
- Stores: scan result, selected hospital/doctor, extracted patient name & medical issue
- Persists to `sessionStorage` so state survives login redirects
- Provides `clearBooking()` to reset after confirmation

**2. Keyword-to-Specialization Mapper (`src/utils/matchDoctors.ts`)** — New
- Maps OCR-detected conditions/keywords to hospital specializations in the existing dataset
- Mapping logic: detected conditions like "Varicocele", "Varicose Veins", "Thyroid Nodule", etc. → match against `hospital.specialization` field using substring/keyword matching
- Returns filtered `Hospital[]` from `src/data/hospitals.ts`

**3. Enhanced Scan Report Page (`src/pages/ScanReport.tsx`)** — Modified
- After scan results display, add a new section: "Recommended Doctors"
- Uses the mapper to filter and display matching hospitals from the existing dataset
- Reuses the existing hospital card UI from `FindHospital.tsx` (extract into a shared `HospitalCard` component)
- Each card gets a "Book Appointment" button that saves the selection to BookingContext and navigates to `/book-appointment`

**4. Shared Hospital Card (`src/components/HospitalCard.tsx`)** — New
- Extract the hospital card markup from `FindHospital.tsx` into a reusable component
- Accept an optional `onBook` callback prop for the booking flow
- Reuse in both `FindHospital` and `ScanReport` pages

**5. Auth Page Update (`src/pages/Auth.tsx`)** — Modified
- After successful login, check BookingContext for pending booking
- If pending booking exists, redirect to `/book-appointment` instead of `/dashboard`

**6. Book Appointment Page (`src/pages/BookAppointment.tsx`)** — New
- Route: `/book-appointment`
- Step 1: Patient details form pre-filled with OCR-extracted `patientName` and `detectedConditions` as "Medical Issue"
- Fields: Patient Name, Age, Gender, Phone, Medical Issue, Preferred Date/Time — all editable
- Step 2: On submit, show confirmation screen with doctor name, hospital, appointment summary
- Auth guard: if not logged in, redirect to `/auth` (BookingContext preserved in sessionStorage)

**7. Route Registration (`src/App.tsx`)** — Modified
- Add `/book-appointment` route pointing to the new page

### Flow Details

1. **Upload & Scan**: Existing flow unchanged. After results render, the mapper runs and shows matched doctors below the biomarker table.

2. **Doctor Selection**: User clicks "Book Appointment" on a doctor card → state saved to BookingContext → navigate to `/book-appointment`.

3. **Auth Check**: BookAppointment page checks `useAuth()`. If not logged in, redirects to `/auth`. Auth page detects pending booking in context and redirects back after login.

4. **Patient Form**: Pre-filled from OCR data (patientName, detectedConditions joined as medical issue). User can edit all fields before confirming.

5. **Confirmation**: Static confirmation screen showing booking summary. No backend appointment table needed initially — this is the UI confirmation step (modular for future backend integration).

### State Persistence Strategy
- `BookingContext` wraps the app in `App.tsx`
- On every state change, sync to `sessionStorage`
- On mount, hydrate from `sessionStorage`
- This ensures state survives the login redirect flow

### No New Data Sources
- All doctors/hospitals come exclusively from `src/data/hospitals.ts`
- No new APIs, no mock data, no database tables for appointments in this phase

