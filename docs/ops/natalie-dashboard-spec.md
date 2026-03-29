# Natalie Dashboard Spec

## Purpose
A lightweight dashboard that mirrors Jorge's exact daily publishing system:
- **Morning:** Daily Tips
- **Midday:** Hydrafacial
- **Evening:** Circadia

Morning and midday are lighter touches.
Evening is the hero post.

## Core dashboard sections

### 1. Daily Cadence Snapshot
Track each day as a three-part sequence:
- Morning Daily Tips status
- Midday Hydrafacial status
- Evening Circadia status
- whether the evening hero post shipped

Recommended fields:
- Date
- Morning Status
- Midday Status
- Evening Status
- Hero Post Complete? (Y/N)
- Notes

### 2. Content Pipeline
Track content by production stage:
- queued idea
- in production
- needs approval
- ready / scheduled

Every content item should also carry:
- Content Lane: Daily Tips / Hydrafacial / Circadia
- Daypart: Morning / Midday / Evening
- Format
- CTA
- Scheduled Slot
- Owner

### 3. Content Performance
Track:
- Daily Tips replies / taps / saves if available
- Hydrafacial saves, profile taps, DMs, bookings
- Circadia hero-post reach, saves, shares, product questions, retail interest
- best-performing hook by lane

### 4. Booking + Revenue Support
Track:
- Hydrafacial bookings this week
- open appointment windows
- bookings influenced by midday Hydrafacial content
- rebooking or retail signals influenced by evening Circadia content

### 5. Notes + Optimization
Track:
- repeated tip themes to avoid
- strongest Hydrafacial objections being answered
- strongest Circadia education angle
- what should be repeated tomorrow
- what felt too salesy and should be softened

## Best format
Recommended implementation:
- one summary dashboard
- one structured content calendar tab
- one lightweight KPI log
- one weekly notes area

## Rule set
- The dashboard should visually reinforce the three-lane model.
- Daily Tips should appear as the morning value touch.
- Hydrafacial should appear as the midday treatment driver.
- Circadia should appear as the evening hero content lane.
- Any seeded demo data should follow this model exactly.
