# Multi-Response Survey Guide

## ✅ Confirmed: Many Responses per Project

The system is **fully designed** to handle multiple survey responses for a single project. This is the intended use case.

## How It Works

### Data Model (One-to-Many Relationship)

```
SurveyProject (1) ←→ (Many) SurveyResponses

One Project → Multiple Responses
```

**Example:**
```
Project: "Digital Strategy Engagement - Acme Corp"
  ├── Response #1: CEO feedback
  ├── Response #2: CTO feedback
  ├── Response #3: Product Manager feedback
  ├── Response #4: Team Lead feedback
  └── Response #5-10: Team member feedback
```

All responses are linked to the same project and aggregated in analytics.

## Workflow

### 1. Create a Project

**Option A: Using the Admin UI (NEW!)**

1. Go to `/admin/projects`
2. Click "New Project"
3. Fill in:
   - Project Name: "Digital Transformation Engagement"
   - Client Name: "Acme Corporation"
   - Engagement Date: "2024-12-01"
   - Engagement Type: "Strategic Consulting"
4. Click "Generate Survey Link"
5. Link is created and auto-copied!

**Option B: Via Database**

```sql
INSERT INTO survey_projects (id, "projectName", "clientName", "engagementType", "isActive")
VALUES ('acme-digital-2024', 'Digital Transformation', 'Acme Corp', 'Consulting', true);
```

### 2. Share ONE Link with Multiple People

**Survey URL:**
```
https://survey.middlez.com/survey/acme-digital-2024
```

**Share this link with:**
- Email to all stakeholders
- Slack message
- Embedded in follow-up documents
- QR code for in-person events

### 3. Each Person Completes Independently

- CEO completes survey → New response created (ID: abc123)
- CTO completes survey → New response created (ID: def456)
- Team members complete → Each creates a unique response

**All responses share the same `projectId: acme-digital-2024`**

### 4. View Aggregated Analytics

**Dashboard URL:**
```
https://survey.middlez.com/admin?project=acme-digital-2024
```

**Shows combined metrics:**
- **Total Responses**: 10 (all stakeholders)
- **NPS**: 45 (calculated from all 10)
- **Promoters**: 6 out of 10
- **Average Satisfaction**: 4.2/5 (across all 10)
- **Word Cloud**: All one-word reflections combined

## New Admin Features

### Project Management UI (`/admin/projects`)

**Features:**
- ✅ Create new projects via form (no SQL needed!)
- ✅ Auto-generate survey links
- ✅ One-click copy survey URL
- ✅ View response count per project
- ✅ See project status (Active/Inactive)
- ✅ Quick access to project-specific analytics

**Screenshot of typical view:**
```
┌─────────────────────────────────────────────────────────┐
│ Digital Transformation Engagement                       │
│ Acme Corporation                                        │
│ Type: Consulting • Date: Dec 1, 2024 • Responses: 7    │
│                                                         │
│ https://survey.middlez.com/survey/acme-digital-2024    │
│ [Copy Link] [View Analytics] [Open Survey]            │
│ ● Active • Created Nov 15, 2024                        │
└─────────────────────────────────────────────────────────┘
```

### Dashboard Filtering

**View all responses:**
```
/admin
```

**View responses for specific project:**
```
/admin?project=acme-digital-2024
```

Analytics automatically filter to show only that project's data.

## Analytics Aggregation Examples

### Scenario: 7 responses to "Digital Strategy" project

**Individual Responses:**
| Respondent | NPS | Satisfaction | Learning | Application | Results |
|------------|-----|--------------|----------|-------------|---------|
| CEO        | 10  | 5            | 5        | 4           | 5       |
| CTO        | 9   | 5            | 5        | 5           | 5       |
| PM #1      | 8   | 4            | 4        | 4           | 4       |
| PM #2      | 7   | 4            | 4        | 3           | 4       |
| Dev #1     | 9   | 5            | 5        | 4           | 4       |
| Dev #2     | 6   | 3            | 4        | 3           | 3       |
| Dev #3     | 5   | 3            | 3        | 3           | 3       |

**Aggregated Analytics:**
- **Total Responses**: 7
- **NPS Score**: 29 (calculated: (3 promoters - 1 detractor) / 7 × 100)
- **NPS Breakdown**:
  * Promoters (9-10): 3 people (CEO, CTO, Dev #1)
  * Passives (7-8): 2 people (PM #1, PM #2)
  * Detractors (0-6): 2 people (Dev #2, Dev #3)
- **Kirkpatrick Averages**:
  * Satisfaction: 4.1/5
  * Learning: 4.3/5
  * Application: 3.7/5
  * Results: 4.0/5

### Word Cloud Example

If one-word reflections are:
- CEO: "Transformative"
- CTO: "Insightful"
- PM #1: "Valuable"
- PM #2: "Insightful"
- Dev #1: "Practical"
- Dev #2: "Helpful"
- Dev #3: "Insightful"

**Word Cloud displays:**
- Insightful (3) - largest
- Transformative (1)
- Valuable (1)
- Practical (1)
- Helpful (1)

## API Endpoints

### Get All Responses for a Project

```bash
GET /api/admin/survey-responses?projectId=acme-digital-2024

# Returns paginated list of all responses for that project
{
  "responses": [
    { "id": "resp1", "respondentName": "Jane Doe", "npsScore": 10, ... },
    { "id": "resp2", "respondentName": "John Smith", "npsScore": 9, ... },
    ...
  ],
  "pagination": { "total": 7, "page": 1, "totalPages": 1 }
}
```

### Get Analytics for a Project

```bash
GET /api/admin/survey-analytics?projectId=acme-digital-2024

# Returns aggregated data for all responses in that project
{
  "overview": {
    "totalResponses": 7,
    "nps": 29,
    "npsBreakdown": { "promoters": 3, "passives": 2, "detractors": 2 }
  },
  "kirkpatrick": {
    "satisfaction": 4.1,
    "learning": 4.3,
    "application": 3.7,
    "results": 4.0
  }
}
```

### Create New Project & Get Link

```bash
POST /api/admin/generate-link
Content-Type: application/json

{
  "projectName": "Innovation Workshop Series",
  "clientName": "TechCorp",
  "engagementDate": "2024-12-15",
  "engagementType": "Workshop"
}

# Returns:
{
  "success": true,
  "project": {
    "id": "innovation-workshop-series-lx4k2p",
    "projectName": "Innovation Workshop Series",
    "clientName": "TechCorp"
  },
  "surveyUrl": "https://survey.middlez.com/survey/innovation-workshop-series-lx4k2p"
}
```

## Best Practices

### 1. One Project Per Engagement

Create a separate project for each distinct consulting engagement:

```
✅ Good:
- "Digital Strategy - Acme Corp - Q4 2024"
- "Leadership Workshop - TechCorp - Dec 2024"
- "Innovation Sprint - StartupCo - Nov 2024"

❌ Avoid:
- "All Acme Corp Surveys" (too broad)
- "2024 Surveys" (loses context)
```

### 2. Share the Same Link

Don't create multiple projects for the same engagement. Share ONE link with all stakeholders:

```
✅ Good:
- Create 1 project: "Digital Strategy - Acme"
- Share link with CEO, CTO, and 5 team members
- Get 7 responses aggregated together

❌ Avoid:
- Creating separate projects for each person
- This defeats the purpose of aggregation
```

### 3. Timing

Send survey link:
- Immediately after engagement completion (hot impressions)
- Or 2-4 weeks later (for Behaviour/Results feedback)
- Set a deadline (e.g., "Please complete by Friday")

### 4. Response Tracking

Monitor response count in `/admin/projects`:
- See how many people have responded
- Follow up with non-respondents
- Close survey when target reached (set `isActive = false`)

## Common Questions

**Q: Can I see individual responses?**
A: Yes! The responses table shows each individual submission. Click on a project in the dashboard to see all responses for that project.

**Q: Can respondents edit their submission?**
A: No. Each submission is final. The survey doesn't use authentication for respondents, so there's no way to identify and edit previous submissions.

**Q: What if I want to send follow-up surveys?**
A: Create a new project (e.g., "Digital Strategy - Acme - 3 Month Follow-up") and share the new link. This keeps the data separate and allows you to track changes over time.

**Q: Can I close a survey?**
A: Yes. In the database, set `isActive = false` for the project. The survey link will no longer accept new responses. (UI toggle coming soon!)

**Q: How many responses can one project have?**
A: Unlimited! The database can handle thousands of responses per project.

**Q: Can I export all responses for a project?**
A: CSV export API is ready. UI coming soon. For now, you can query:
```sql
SELECT * FROM survey_responses WHERE "projectId" = 'your-project-id';
```

## Summary

✅ **One Project** = One engagement/consulting project
✅ **One Link** = Share with unlimited stakeholders
✅ **Many Responses** = Each person creates their own response
✅ **Aggregated Analytics** = All responses combined in dashboard
✅ **Easy Management** = Create and share links via `/admin/projects`

The system is **designed from the ground up** for this exact use case! 🎉
