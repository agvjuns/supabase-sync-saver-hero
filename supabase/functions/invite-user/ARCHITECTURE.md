# Supabase Invite-User Edge Function Architecture

## Overview

This document describes the architecture and security model for the `invite-user` Supabase Edge Function, which is responsible for inviting users to an organization. It ensures that only organization admins can invite users, and that new users are added to both the `organization_members` and `profiles` tables via a secure, invite-only flow.

---

## 1. Invite Flow

- **Only organization admins** can invite users.
- The function checks:
  - Admin privileges
  - Organization existence
  - Member limits
  - Duplicate membership
- Sends an invite via Supabase Auth.
- Handles both new and existing users:
  - If the user already exists, ensures they are present in both `organization_members` and `profiles`.
  - If the user is new, records the invitation and waits for signup.

---

## 2. Database Integrity

- **No other Edge Functions** or SQL migrations insert into `organization_members` for new signups.
- **No triggers or Postgres functions** insert into `organization_members` on Auth signup.
- **No insertion into the `organizations` table** during the invite process.

---

## 3. Security: Row Level Security (RLS)

- RLS is enabled on `organization_members`.
- Policies:
  - **Admins can manage organization members** (insert/update/delete).
  - **Members can view organization members**.
- No policy allows arbitrary users to insert themselves as members.

---

## 4. Architecture Diagram

```mermaid
flowchart TD
    A[Organization Admin] --calls--> B[invite-user Edge Function]
    B --checks--> C[Admin Rights, Org Existence, Member Limit]
    B --invites via Auth--> D[Supabase Auth]
    D --user accepts invite--> E[Signup/Accept Invite]
    B --inserts--> F[organization_members (role="user", status)]
    B --inserts--> G[profiles]
    E --completes--> H[User is now a member]
    style F fill:#e0ffe0,stroke:#333,stroke-width:2px
    style G fill:#e0ffe0,stroke:#333,stroke-width:2px
```

---

## 5. Summary Table

| Requirement                                      | Status         | Notes                                      |
|--------------------------------------------------|---------------|--------------------------------------------|
| Only invite flow inserts into organization_members| ✅ Met         | Only edge function does this               |
| Insert into profiles as part of invite           | ✅ Met         | Handled in edge function                   |
| No insert into organizations table               | ✅ Met         | Not present in edge function               |
| No direct Auth signup inserts into org_members   | ✅ Met         | No triggers/functions found                |
| RLS restricts insert to admins/service role      | ✅ Met         | Policy exists in migrations                |

---

## 6. Action Items

- All requirements are currently met.
- All member additions must go through the invite flow.
- RLS policies ensure only admins or the service role can insert into `organization_members`.

---

## 7. Maintenance Notes

- If you add new Auth triggers or Edge Functions, ensure they do not insert into `organization_members` for new signups.
- Review RLS policies if you change organization membership logic.
- Monitor for any direct insertions into `organization_members` outside the invite flow.