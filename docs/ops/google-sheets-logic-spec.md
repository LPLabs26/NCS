# Google Sheets Logic Spec

## Goal
Define formulas, validation rules, and formatting logic for the future NCS Aesthetics Google Sheets dashboard.

## Dashboard formulas
### Suggested source relationships
- bookings pulled from `Booking Tracker`
- content counts pulled from `Content Calendar`
- leads pulled from `Leads + DMs`
- weekly notes entered manually

### Example calculations
- Total bookings this week = count of rows in Booking Tracker where `Booked? = Y` and date is within current week
- Hydrafacial bookings = count of rows where service contains Hydrafacial and `Booked? = Y`
- Custom Facial bookings = count of rows where service = Custom Facial and `Booked? = Y`
- Peel bookings = count of rows where service contains Peel and `Booked? = Y`
- Open appointment windows = count of rows where `Booked? = N`
- Reels posted this week = count of Content Calendar rows where `Format = Reel` and `Posted? = Y`
- Stories posted this week = count of Content Calendar rows where `Format = Story` and `Posted? = Y`
- New leads / DMs this week = count of Leads rows within current week

## Conditional formatting ideas
### Content Calendar
- green if `Posted? = Y`
- yellow if date is within 2 days and `Posted? = N`
- red if date has passed and `Posted? = N`

### Booking Tracker
- green if `Booked? = Y`
- light red if `Booked? = N`
- highlight rows where `Filled From Promotion? = Y`

### Leads + DMs
- yellow if `Response Sent? = N`
- orange if follow-up date is today
- red if follow-up date has passed and `Booked? = N`

## Validation rules
### Booking Tracker
- `Booked?` -> dropdown: Y / N
- `New or Returning Client` -> New / Returning
- `Deposit Collected?` -> Y / N
- `Filled From Promotion?` -> Y / N
- `Promotion Type` -> None / Story urgency / Gap-fill post / DM follow-up / Flash promo

### Content Calendar
- `Platform` -> Instagram / Stories / Reels / Carousel
- `Format` -> Reel / Story / Carousel / Static / Testimonial / FAQ
- `Content Pillar` -> Luxury Glow / Results / Education / Authority / Personalized Care / Social Proof / Fresno Lifestyle
- `Offer Tied In` -> Hydrafacial / Custom Facial / Chemical Peel / Consultation / Other
- `Posted?` -> Y / N

### Leads + DMs
- `Platform` -> Instagram DM / Text / Booking site / Referral / In person
- `Service Interest` -> Hydrafacial / Custom Facial / Chemical Peel / Not sure / Other
- `Main Concern` -> Acne / Dullness / Texture / Aging / Pigment / Sensitive skin / General glow
- `Response Sent?` -> Y / N
- `Booked?` -> Y / N

## Dashboard build order
1. Create tabs
2. Paste CSV headers
3. Add dropdowns / validation
4. Freeze header rows
5. Add conditional formatting
6. Add KPI formulas
7. Style dashboard last

## Styling rules
- one accent color only
- avoid overly saturated colors
- use soft neutrals + one luxury accent
- keep dashboard minimal and executive-friendly
