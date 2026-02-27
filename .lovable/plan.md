

## Plan: Sub-Admin System with Permissions + Razorpay Removal

### Part 1: Remove Razorpay Completely

**Files to modify:**
- `src/pages/admin/AdminSettings.tsx` — Remove Razorpay state, fetch, save logic, and UI section (lines 20-21, 43-45, 54-55, 196-226, 465-491)
- `src/hooks/useRazorpay.ts` — Delete entire file
- `src/hooks/usePaymentRetry.ts` — Delete entire file  
- `index.html` — Remove Razorpay script tag if present
- `src/components/wallet/PaymentHistoryModal.tsx` — Remove razorpay_payment_id display

### Part 2: Create Sub-Admin Management System

**Database changes (migration):**
1. Create `sub_admins` table:
   - `id` (uuid, PK)
   - `email` (text, unique, not null)
   - `created_by` (uuid, references auth.users)
   - `permissions` (text[] — array of allowed sections like `['dashboard', 'tournaments', 'utr', 'withdrawals', 'users', 'referrals', 'fraud-analytics', 'support', 'tournament-analytics', 'settings']`)
   - `is_active` (boolean, default true)
   - `display_name` (text — YouTuber/admin name)
   - `created_at` (timestamptz)
2. Enable RLS — only super admin can CRUD
3. Grant `user_roles` admin role when creating sub-admin (via signup + role insert)

**Auth flow for sub-admin creation:**
- Super admin enters email + password + display name + selects permissions
- Call `supabase.auth.admin.createUser()` via an edge function (since client can't create users for others)
- Insert into `sub_admins` table with selected permissions
- Insert admin role into `user_roles`

**New edge function: `create-sub-admin`**
- Accepts: email, password, display_name, permissions[]
- Creates auth user via service role
- Inserts profile, user_role (admin), and sub_admin record
- Returns success/error

**New edge function: `delete-sub-admin`**
- Accepts: sub_admin_id
- Removes auth user, profile, roles, and sub_admin record

### Part 3: Permission-Based Admin Panel

**Files to modify:**

- `src/contexts/AuthContext.tsx` — After confirming admin role, fetch `sub_admins` table to get `permissions` array. Super admin gets all permissions. Store `permissions` in context.

- `src/components/layout/AdminLayout.tsx` — Filter `menuItems` based on permissions from context. Super admin sees everything + new "Manage Admins" menu item. Sub-admins only see their allowed sections.

- `src/pages/admin/AdminSettings.tsx` — Add "Sub-Admin Management" section (only visible to super admin):
  - Form: email, password, display name
  - Checkboxes for each admin section (Dashboard, Tournaments, UTR Verify, Withdrawals, Users, Referrals, Fraud Analytics, Support, Analytics, Settings)
  - List of existing sub-admins with permissions and delete button

**New page: `src/pages/admin/ManageAdmins.tsx`** (better to keep it separate)
- Shows list of all sub-admins
- Create form with email/password/name + permission checkboxes
- Edit permissions for existing sub-admins
- Delete sub-admin

**Route addition in `src/App.tsx`:**
- Add `/admin/manage-admins` route

### Technical Details

```text
Sub-Admin Flow:
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│ Super Admin  │────>│ create-sub-admin │────>│ auth.users   │
│ enters info  │     │ edge function    │     │ + profiles   │
│ + permissions│     │                  │────>│ + user_roles │
└──────────────┘     └─────────────────┘     │ + sub_admins │
                                              └──────────────┘

Login Flow:
┌──────────┐     ┌───────────┐     ┌──────────────┐
│ Sub-admin│────>│ Auth check│────>│ Fetch perms  │
│ logs in  │     │ is admin? │────>│ from sub_    │
└──────────┘     └───────────┘     │ admins table │
                                    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │ Show only    │
                                    │ allowed menu │
                                    │ items        │
                                    └──────────────┘
```

### Summary of Changes
1. Remove all Razorpay code (UI + hooks + settings)
2. Create `sub_admins` database table with permissions array
3. Create `create-sub-admin` edge function for account creation
4. Create `ManageAdmins.tsx` page for super admin
5. Update `AuthContext` to fetch and store permissions
6. Update `AdminLayout` to filter menu items by permissions
7. Add route protection so sub-admins can't access unauthorized sections

