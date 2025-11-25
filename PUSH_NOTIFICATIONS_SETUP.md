# Push Notifications Setup Guide

## Overview
Push notifications have been implemented to send real-time alerts to users even when the app is closed. This works on mobile and desktop browsers that support PWA.

## Current Implementation

### ✅ Completed Features
1. **Database**: `push_subscriptions` table created with RLS policies
2. **Service Worker**: Custom service worker (`public/sw.js`) handles push events
3. **Frontend Hook**: `usePushNotifications` hook manages subscriptions
4. **UI Component**: `PushNotificationToggle` in notification bell dropdown
5. **Edge Function**: `send-push-notification` ready to send notifications
6. **Integration**: Tournament reminders and payment success automatically trigger push notifications

### 🔧 Required Setup

#### Step 1: Generate VAPID Keys
You need to generate VAPID keys for Web Push authentication.

**Option 1: Using web-push CLI (Recommended)**
```bash
npm install -g web-push
web-push generate-vapid-keys
```

**Option 2: Using Online Generator**
Visit: https://vapidkeys.com/

#### Step 2: Add VAPID Keys as Secrets
Once you have your VAPID keys, add them as Lovable Cloud secrets:
1. `VAPID_PUBLIC_KEY` - The public key (also update in `src/hooks/usePushNotifications.ts`)
2. `VAPID_PRIVATE_KEY` - The private key (keep secure!)

#### Step 3: Update Public Key in Code
Replace the placeholder key in `src/hooks/usePushNotifications.ts`:
```typescript
const VAPID_PUBLIC_KEY = 'YOUR_ACTUAL_PUBLIC_KEY_HERE';
```

## How It Works

### User Flow
1. User clicks notification bell in navbar
2. Sees "Push Notifications" toggle in dropdown
3. Clicks "Enable" → browser asks for permission
4. User grants permission → subscription saved to database
5. User receives push notifications even when app is closed

### Backend Flow
1. Event occurs (tournament start, payment success, etc.)
2. In-app notification created in `notifications` table
3. Edge function `send-push-notification` invoked
4. Fetches user's push subscriptions from database
5. Sends push notification via Web Push Protocol
6. User's device shows native notification

## Notification Triggers

### 🎮 Tournament Reminders
- Sent 15-20 minutes before tournament starts
- Triggered by `tournament-reminders` cron job
- Type: `match`

### 💰 Payment Success
- Sent immediately after successful deposit
- Triggered by `handle-payment-success` edge function
- Type: `wallet`

### 🏆 Prize Notifications
- Can be triggered when user wins/receives prizes
- Type: `prize`

### 📢 System Notifications
- Admin announcements, updates, etc.
- Type: `system`

## Testing Push Notifications

### 1. Enable Notifications
- Login to your app
- Click notification bell
- Toggle "Enable" on push notifications
- Grant browser permission

### 2. Test via Edge Function
Call the edge function directly:
```typescript
const { data, error } = await supabase.functions.invoke('send-push-notification', {
  body: {
    userId: 'USER_ID_HERE',
    title: 'Test Notification',
    message: 'This is a test push notification!',
    type: 'system',
    url: '/'
  }
});
```

### 3. Test Tournament Reminders
- Create a tournament starting in 16 minutes
- Wait for the cron job to run
- Check for push notification

## Browser Support

✅ **Supported**
- Chrome (Desktop & Android)
- Edge (Desktop & Android)
- Firefox (Desktop & Android)
- Safari 16.4+ (Desktop & iOS)
- Samsung Internet
- Opera (Desktop & Android)

❌ **Not Supported**
- Safari < 16.4
- Internet Explorer
- Older browsers

## Security Notes

1. **RLS Policies**: Users can only manage their own subscriptions
2. **Service Role Key**: Edge function uses service role for admin operations
3. **VAPID Keys**: Keep private key secure, never expose in client code
4. **User Permissions**: Browser requires explicit user permission

## Troubleshooting

### Notifications Not Working?
1. Check if user granted permission (check browser settings)
2. Verify VAPID keys are configured correctly
3. Check browser console for errors
4. Ensure service worker is registered
5. Check if push subscription exists in database

### Invalid Subscriptions
The edge function automatically removes invalid subscriptions (410 Gone responses).

### Testing on iOS
- Requires iOS 16.4+ and Safari
- Must add to home screen (PWA mode)
- Notifications only work when app is installed as PWA

## Future Enhancements

- [ ] Add notification preferences (choose which types to receive)
- [ ] Add quiet hours (don't send notifications during certain times)
- [ ] Add notification history/archive
- [ ] Add click action routing (open specific pages on click)
- [ ] Add notification grouping
- [ ] Add sound customization
- [ ] Add vibration patterns
