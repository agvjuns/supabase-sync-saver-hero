# Backend Implementation Plan

## Product Requirements Document (PRD)

**1. Introduction**

This document outlines the requirements for the backend implementation of the geo-inventory application, focusing on establishing a multi-tenant architecture with robust authorization, user management, and payment processing capabilities using Supabase.

**2. Goals**

*   Implement secure tenant isolation for inventory data using Supabase Row Level Security (RLS).
*   Establish a clear role hierarchy within each organization (`admin`, `user`).
*   Enable a streamlined signup process for new company administrators.
*   Implement a secure invitation flow for administrators to add team members.
*   Integrate Stripe for managing paid subscriptions at the organization level.
*   Utilize Supabase Edge Functions for specific backend logic (e.g., user invitation, Stripe webhooks).
*   Ensure compatibility with existing frontend signup, login, and password reset forms.

**3. User Roles and Permissions**

*   **Company Admin:**
    *   Can sign up a new company/organization.
    *   Is the initial user for a new organization.
    *   Can invite new users to their organization.
    *   Can manage (view, add, edit, delete) inventory for their organization.
    *   Can manage organization settings and subscription (Stripe integration).
    *   Only one admin per organization.
*   **Team Member (User):**
    *   Can accept invitations to join an organization.
    *   Can manage (view, add, edit, delete) inventory for their organization.
    *   Cannot invite new users or manage organization settings/subscription.

**4. Core Features**

*   **Signup:**
    *   Allows a new user to create an account and a new organization simultaneously.
    *   The signing up user is automatically assigned the 'admin' role for the new organization.
    *   Enforce the one-admin-per-company rule (handled by the signup flow logic).
*   **Login:**
    *   Allows existing users to log in using email and password via Supabase Auth.
*   **Password Reset:**
    *   Allows users to reset their password via Supabase Auth's standard flow.
*   **Invite Team Member:**
    *   Initiated by a Company Admin.
    *   Sends an invitation email to a specified email address.
    *   Links the invited user (via email) to the organization with a 'pending' status in `organization_members`.
    *   Upon invitation acceptance and signup completion, the user's status in `organization_members` is updated to 'active'.
*   **Tenant Isolation (Inventory):**
    *   Inventory data is strictly separated by `organization_id`.
    *   Users can only view, add, edit, or delete inventory items belonging to their associated organization.
*   **Stripe Integration:**
    *   Allows organizations to subscribe to paid plans.
    *   Manages subscription status and member limits based on the plan.
    *   Requires handling Stripe webhooks for subscription lifecycle events.

**5. Requirements**

*   **Functional:**
    *   Implement database schema as defined in the Implementation Plan.
    *   Configure Supabase Auth for email/password signup, login, and password reset.
    *   Implement RLS policies on the `inventory` table to enforce tenant isolation based on `organization_id`.
    *   Implement RLS policies on `profiles` and `organization_members` to allow users to manage their own profile and view/manage members within their organization based on their role.
    *   Create database functions and triggers for automated profile and organization member creation upon new user signup.
    *   Develop a Supabase Edge Function (`invite-user`) to handle sending invitations and recording pending members.
    *   Develop a Supabase Edge Function (e.g., `stripe-webhook`) to handle Stripe webhook events (e.g., subscription creation, updates, cancellations).
    *   Ensure the signup process correctly creates an organization and assigns the admin role.
    *   Ensure the invite acceptance process correctly links the user to the organization and updates their status.
    *   Implement logic to enforce the one-admin-per-company rule during signup.
    *   Implement logic to check member limits during the invite process.
*   **Non-Functional:**
    *   Security: All sensitive operations must be protected by RLS and proper authorization checks.
    *   Performance: Database queries and functions should be optimized for performance.
    *   Scalability: The architecture should be scalable to accommodate multiple organizations and users.
    *   Maintainability: Code should be well-structured, commented, and follow best practices.

## Implementation Plan

**1. Database Schema Design**

Define the following tables in the `public` schema:

*   `organizations`: Stores information about each company/tenant.
*   `profiles`: Stores user profile information, linked to `auth.users` and `organizations`.
*   `organization_members`: Links users to organizations and defines their role and status within the organization.
*   `inventory`: Stores inventory items, linked to `organizations` for tenant isolation.

```mermaid
erDiagram
    organizations {
        uuid id PK
        text name "NOT NULL"
        text subscription_tier "DEFAULT 'free'"
        timestamp with time zone created_at
        timestamp with time zone updated_at
        text stripe_customer_id
        text subscription_status "DEFAULT 'inactive'"
        integer member_limit "DEFAULT 20"
        text billing_email
    }
    auth.users {
        uuid id PK
        text email "NOT NULL"
        timestamp with time zone created_at
        timestamp with time zone updated_at
        jsonb raw_user_meta_data
        -- other standard auth fields
    }
    profiles {
        uuid id PK "FK to auth.users (id)"
        text email "NOT NULL"
        text full_name
        uuid organization_id FK "NOT NULL"
        text role "DEFAULT 'user'" -- 'admin', 'user'
        timestamp with time zone created_at
        timestamp with time zone updated_at
        text avatar_url
        constraint profiles_organization_id_fkey foreign key (organization_id) references organizations (id) on delete CASCADE
    }
    organization_members {
        uuid id PK DEFAULT gen_random_uuid()
        uuid user_id FK "NULLABLE - for pending invites"
        uuid organization_id FK "NOT NULL"
        text role "DEFAULT 'user'" -- 'admin', 'user'
        timestamp with time zone created_at DEFAULT now()
        timestamp with time zone updated_at DEFAULT now()
        text status "DEFAULT 'pending'" -- 'pending', 'active'
        text email "NOT NULL" -- email of invited user
        text name -- name of invited user
        constraint organization_members_user_id_organization_id_key unique (user_id, organization_id)
        constraint organization_members_organization_id_fkey foreign key (organization_id) references organizations (id) on delete CASCADE
        constraint organization_members_user_id_fkey foreign key (user_id) references auth.users (id) on delete CASCADE
    }
    inventory {
        uuid id PK DEFAULT gen_random_uuid()
        uuid organization_id FK "NOT NULL"
        text item_name "NOT NULL"
        integer quantity
        timestamp with time zone created_at DEFAULT now()
        timestamp with time zone updated_at DEFAULT now()
        -- other inventory-specific fields
        constraint inventory_organization_id_fkey foreign key (organization_id) references organizations (id) on delete CASCADE
    }

    auth.users ||--o{ profiles : "has one"
    organizations ||--o{ profiles : "has many"
    organizations ||--o{ organization_members : "has many"
    auth.users }o--|| organization_members : "has many"
    organizations ||--o{ inventory : "has many"
```

**2. Supabase Setup**

*   **Supabase Auth:** Configure email/password authentication. Ensure email confirmations are enabled.
*   **Database:** Apply the defined schema using Supabase migrations.
*   **RLS:** Enable RLS for `profiles`, `organization_members`, and `inventory` tables.
*   **Storage:** (If needed for avatars or inventory images) Configure Supabase Storage and RLS policies.

**3. Database Functions and Triggers**

*   **`handle_new_user()` function:**
    *   Triggered `AFTER INSERT ON auth.users`.
    *   Checks if the user is invited (`new.raw_user_meta_data->>'invited'`). If true, exits.
    *   If not invited, creates a new row in the `organizations` table.
    *   Inserts a row into the `profiles` table, linking to the new user and organization, with `role` set to 'admin'.
    *   (Optional: Insert into `organization_members` for the admin, though the PRD suggests `organization_members` is for invited users. Revisit this based on desired admin management flow).
*   **`handle_invited_user()` function:**
    *   Triggered `AFTER INSERT ON auth.users`.
    *   Checks if the user is invited (`new.raw_user_meta_data->>'invited'`). If false, exits.
    *   If invited, updates the corresponding row in `organization_members` (found by email and organization ID from metadata) to set `user_id = new.id` and `status = 'active'`.
*   **`create_profile_for_new_users()` function:**
    *   Triggered `AFTER INSERT ON auth.users`.
    *   Inserts a basic row into the `profiles` table using `new.id` and `new.email`. This ensures every user has a profile regardless of whether they were invited or signed up directly. (This function was created during previous troubleshooting and should be kept).
*   **Triggers on `auth.users`:**
    *   `new_user_trigger`: `AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();` (Ensure this trigger exists and is enabled).
    *   `on_auth_user_created`: `AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_invited_user();` (Ensure this trigger exists and is enabled).
    *   (Ensure the `create_profile_for_new_users` trigger is also active).

**4. Row Level Security (RLS)**

*   **`organizations` table:**
    *   `SELECT`: Allow users to select organizations they are members of (via `organization_members`).
    *   `INSERT`: Deny (organizations are created by the `handle_new_user` trigger).
    *   `UPDATE`: Allow admins of an organization to update their organization's details.
    *   `DELETE`: Deny (or allow super admins if needed).
*   **`profiles` table:**
    *   `SELECT`: Allow users to select their own profile and profiles of other members in their organization.
    *   `INSERT`: Deny (profiles are created by triggers).
    *   `UPDATE`: Allow users to update their own profile.
    *   `DELETE`: Deny (profiles are deleted via CASCADE from `auth.users`).
*   **`organization_members` table:**
    *   `SELECT`: Allow users to select members of their own organization.
    *   `INSERT`: Allow admins to insert new pending members (via the `invite-user` function, which runs with `SECURITY DEFINER`). Deny for other roles.
    *   `UPDATE`: Allow admins to update member roles/status within their organization. Allow users to update their own status (e.g., accept invite - though this is handled by the trigger).
    *   `DELETE`: Allow admins to remove members from their organization.
*   **`inventory` table:**
    *   `SELECT`: Allow users to select inventory items where `organization_id` matches their organization ID (obtained via `profiles` or `organization_members`).
    *   `INSERT`: Allow users to insert inventory items with their organization ID.
    *   `UPDATE`: Allow users to update inventory items within their organization.
    *   `DELETE`: Allow users to delete inventory items within their organization.

*(Note: RLS policies will require careful implementation using `auth.uid()`, `auth.email()`, and potentially custom helper functions to get the user's organization ID and role.)*

**5. Supabase Edge Functions**

*   **`invite-user` function:**
    *   Receives POST requests with invited user's email, organization ID, role, and name.
    *   Authenticates the requesting user and verifies they are an admin of the specified organization (using an RPC like `check_admin_role`).
    *   Checks if the organization exists and if the member limit has been reached.
    *   Checks if the user is already a member.
    *   Uses `supabaseAdmin.auth.admin.inviteUserByEmail` to send the invitation email with necessary metadata (`organization_id`, `role`, `invited: true`, `full_name`).
    *   Inserts a row into `organization_members` with `status: 'pending'`, linking the email and organization ID.
    *   Handles potential errors (e.g., user already exists in Auth).
*   **`stripe-webhook` function:**
    *   Receives POST requests from Stripe webhook events.
    *   Verifies the webhook signature.
    *   Processes relevant events (e.g., `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`).
    *   Updates the `organizations` table with subscription status, member limits, etc., based on the event data.

**6. Frontend Integration**

*   **Signup Form:** Call Supabase Auth `signUp` with email, password, and include `full_name` and `organization_name` in the `data` field for `raw_user_meta_data`.
*   **Login Form:** Call Supabase Auth `signInWithPassword`.
*   **Password Reset:** Call Supabase Auth `resetPasswordForEmail`.
*   **Invite Form:** Call the `invite-user` Edge Function with the invited user's details and the admin's organization ID.
*   **Inventory Pages:** Use the Supabase client to interact with the `inventory` table. RLS will automatically filter data based on the logged-in user's organization.
*   **Team Members Page:** Use the Supabase client to interact with the `organization_members` table (view, delete members) and potentially the `profiles` table (view member profiles). RLS will enforce permissions.
*   **Organization Settings/Billing Page:** Interact with the `organizations` table (view/update settings) and potentially trigger Stripe checkout flows.

**7. Stripe Integration Details**

*   Use the Stripe Node.js library within Edge Functions.
*   Store `stripe_customer_id` and `subscription_status` in the `organizations` table.
*   Implement logic to update `member_limit` based on the subscription tier received from Stripe webhooks.
*   Consider using Stripe Checkout for initiating subscriptions.

**8. Testing Considerations**

*   Unit tests for database functions and Edge Functions.
*   Integration tests for the signup and invite flows.
*   Test RLS policies thoroughly for each role and table.
*   Test Stripe webhook handling with test events.

**9. Deployment Steps**

*   Apply database schema and migrations using `npx supabase migrate deploy`.
*   Deploy Edge Functions using `npx supabase functions deploy <function-name>`.
*   Configure Stripe webhooks to point to the deployed `stripe-webhook` Edge Function endpoint.