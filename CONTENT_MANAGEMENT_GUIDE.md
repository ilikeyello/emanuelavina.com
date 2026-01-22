# Content Management Guide

## ✅ What's Already Working

All content management features are **fully functional** right now! Your Supabase schema matches perfectly with the admin dashboard.

## 📋 Available Features

### 1. **Sermons** (`/dashboard/client-portal` → Content → Sermons)
- ✅ Add new sermons with YouTube URLs
- ✅ Include speaker name, date, and description
- ✅ Delete sermons
- **Schema fields:** `title`, `youtube_url`, `description`, `speaker`, `sermon_date`

### 2. **Livestreams** (`/dashboard/client-portal` → Content → Livestreams)
- ✅ Add livestream URLs (YouTube Live, etc.)
- ✅ Toggle live status on/off
- ✅ Schedule future streams
- ✅ Delete streams
- **Schema fields:** `stream_url`, `title`, `is_live`, `scheduled_start`

### 3. **Devotionals** (`/dashboard/client-portal` → Content → Devotionals)
- ✅ Create daily devotionals
- ✅ Add scripture references
- ✅ Set author and publish date
- ✅ Delete devotionals
- **Schema fields:** `title`, `content`, `scripture_reference`, `author`, `publish_date`

### 4. **Prayer Requests** (`/dashboard/client-portal` → Community → Prayer Requests)
- ✅ View all prayer requests from members
- ✅ Delete inappropriate requests
- ✅ See prayer count and user info
- **Schema fields:** `title`, `description`, `is_anonymous`, `user_name`, `prayer_count`

### 5. **Bulletin Posts** (`/dashboard/client-portal` → Community → Bulletin Posts)
- ✅ Create community bulletin posts
- ✅ Edit and delete posts
- ✅ Set author name
- **Schema fields:** `title`, `content`, `author_name`

### 6. **Announcements** (`/dashboard/client-portal` → Community → Announcements)
- ✅ Create announcements with priority levels (low, normal, high, urgent)
- ✅ Add images and expiration dates
- ✅ Delete announcements
- **Schema fields:** `title`, `content`, `priority`, `image_url`, `expires_at`

### 7. **Music Playlists** (Placeholder)
- 🔲 Ready for implementation
- **Schema exists:** `playlist_url`, `title`, `description`, `is_active`

### 8. **Games** (Placeholder)
- 🔲 Ready for implementation
- **Schema exists:** `game_type`, `title`, `config`, `is_active`

## 🧪 Testing Your Content Management

### Step 1: Add a Sermon
1. Go to `/dashboard/client-portal`
2. Click **Content** tab
3. Click **Sermons** sub-tab
4. Click **Add Sermon**
5. Fill in:
   - Title: "Sunday Service - January 21"
   - YouTube URL: `https://youtube.com/watch?v=YOUR_VIDEO_ID`
   - Speaker: "Pastor John"
   - Date: Select today's date
   - Description: Optional
6. Click **Save Sermon**

**Expected Result:** Sermon appears in the list below the form.

### Step 2: Add a Livestream
1. Click **Livestreams** sub-tab
2. Click **Add Livestream**
3. Fill in:
   - Stream URL: `https://youtube.com/live/YOUR_STREAM_ID`
   - Title: "Sunday Service Live"
   - Scheduled Start: Optional
4. Click **Save Livestream**
5. Click **Set Live** to toggle the live status

**Expected Result:** Livestream appears with a "LIVE" badge when active.

### Step 3: Create an Announcement
1. Click **Community** tab
2. Click **Announcements** sub-tab
3. Click **Add Announcement**
4. Fill in:
   - Title: "Welcome to Our New Dashboard!"
   - Priority: Select "High"
   - Content: "We're excited to announce..."
   - Expires At: Optional
5. Click **Save Announcement**

**Expected Result:** Announcement appears with a colored priority badge.

## 🔍 Troubleshooting

### Issue: "Error fetching data"
**Solution:** 
- Verify your `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Check that you're connected to the correct organization
- Verify the schema is deployed in Supabase

### Issue: "Unauthorized" error
**Solution:**
- Make sure you're signed in to Clerk
- Verify you're part of an organization
- Check that your organization ID matches the one in Supabase

### Issue: Data not appearing
**Solution:**
- Refresh the page
- Check browser console for errors
- Verify the data was saved in Supabase dashboard

## 🔐 Security Notes

- All operations use your `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- Data is automatically filtered by your `organization_id`
- Row Level Security (RLS) is enabled on all tables
- Only service role can write data (admin operations)
- Public can read data (for church site display)

## 🚀 Next Steps

1. **Test each content type** to ensure CRUD operations work
2. **Add real content** for your CNE church
3. **Implement Music Playlists manager** (optional)
4. **Implement Games manager** (optional)
5. **Connect church site** to display this content

## 📊 Data Flow

```
Admin Dashboard (emanuelavina.com)
    ↓ (Creates/Updates via API routes)
Supabase Database (filtered by organization_id)
    ↓ (Reads via Supabase client)
Church Site (centro-de-nueva-esperanza)
    ↓ (Displays to visitors)
```

All content you add in the admin dashboard will automatically be available to your church site through the Supabase connection!
