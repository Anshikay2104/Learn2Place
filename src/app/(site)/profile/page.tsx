// app/(site)/profile/page.tsx
import React from 'react';
import Image from 'next/image';
import { 
  Briefcase, 
  MapPin, 
  BookOpen, 
  MessageSquare, 
  Bookmark, 
  Edit, 
  GraduationCap,
  Award,
  Link as LinkIcon
} from 'lucide-react';

// --- DUMMY DATA ---
// TODO: Replace this with data fetched from your database (e.g., using Prisma or Supabase)
const userData = {
  id: 'user123',
  name: 'Sarah Johnson',
  role: 'Alumni', // Could also be 'Student'
  avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80',
  bio: 'Software Engineer at TechCorp. Passionate about mentoring students and sharing resources on web development and career growth. Class of 2018.',
  course: 'B.Tech Computer Science',
  gradYear: 2018,
  currentJob: 'Software Engineer',
  company: 'TechCorp',
  location: 'San Francisco, CA',
  stats: {
    resources: 18,
    posts: 42,
    upvotes: 230,
  }
};

// TODO: Fetch this user's shared resources
const userResources = [
  { id: 'res1', title: 'Data Structures & Algorithms - Complete Notes', type: 'PDF' },
  { id: 'res2', title: 'React Hooks Deep Dive', type: 'Video' },
  { id: 'res3', title: 'System Design Interview Prep Guide', type: 'Link' },
];

// TODO: Fetch this user's recent forum activity
const userActivity = [
  { id: 'act1', type: 'answered', text: 'How to deploy a Next.js app on Vercel?' },
  { id: 'act2', type: 'asked', text: 'Best way to handle authentication in 2025?' },
  { id: 'act3', type: 'answered', text: 'Looking for good resources on microservices...' },
];
// --- END DUMMY DATA ---


export default function ProfilePage() {
  
  // This check would determine if the logged-in user is viewing their *own* profile
  const isOwnProfile = true; // TODO: Implement logic to check auth

  return (
    <div className="bg-gray-50 min-h-screen pt-48 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* === LEFT COLUMN: PROFILE CARD === */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              
              {isOwnProfile && (
                <button 
                  className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 transition-colors"
                  title="Edit Profile"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}

              <div className="flex flex-col items-center">
                <Image
                  src={userData.avatarUrl}
                  alt={userData.name}
                  width={128}
                  height={128}
                  className="rounded-full object-cover mb-4 shadow-md"
                />
                <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                
                {/* Role Badge */}
                <span className={`px-3 py-1 mt-2 rounded-full text-sm font-semibold ${
                  userData.role === 'Alumni' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {userData.role}
                </span>

                <p className="text-center text-gray-600 mt-4">{userData.bio}</p>
              </div>

              {/* --- User Details --- */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Details</h3>
                <ul className="mt-2 space-y-3">
                  <li className="flex items-center text-gray-700">
                    <GraduationCap className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{userData.course}</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Award className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Class of {userData.gradYear}</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{userData.location}</span>
                  </li>

                  {/* Alumni-specific info */}
                  {userData.role === 'Alumni' && (
                    <li className="flex items-center text-gray-700">
                      <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
                      <span>{userData.currentJob} at <strong>{userData.company}</strong></span>
                    </li>
                  )}
                </ul>
              </div>

            </div>
          </aside>

          {/* === RIGHT COLUMN: STATS & ACTIVITY === */}
          <main className="lg:col-span-2">

            {/* --- Quick Stats --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Resources Shared" value={userData.stats.resources} icon={BookOpen} />
              <StatCard title="Forum Posts" value={userData.stats.posts} icon={MessageSquare} />
              <StatCard title="Upvotes Received" value={userData.stats.upvotes} icon={Award} />
            </div>

            {/* --- Tabbed Content (Simplified) --- */}
            <div className="mt-8">
              {/* We can use tabs here, but for simplicity, we'll use sections */}

              {/* --- My Shared Resources --- */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Shared Resources</h2>
                <ul className="space-y-4">
                  {userResources.map(res => (
                    <li key={res.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                      <div className="flex items-center">
                        <LinkIcon className="w-5 h-5 mr-3 text-indigo-600" />
                        <span className="text-gray-800 font-medium">{res.title}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{res.type}</span>
                    </li>
                  ))}
                  {userResources.length === 0 && (
                    <p className="text-gray-500">No resources shared yet.</p>
                  )}
                </ul>
              </div>

              {/* --- My Forum Activity --- */}
              <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Forum Activity</h2>
                <ul className="space-y-4">
                  {userActivity.map(act => (
                    <li key={act.id} className="flex items-start p-3">
                      <span className={`mr-3 mt-1 flex-shrink-0 px-2 py-0.5 rounded text-xs font-semibold ${
                        act.type === 'answered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {act.type}
                      </span>
                      <p className="text-gray-700">{act.text}</p>
                    </li>
                  ))}
                  {userActivity.length === 0 && (
                    <p className="text-gray-500">No forum activity yet.</p>
                  )}
                </ul>
              </div>

              {/* --- Bookmarked Items (Only for own profile) --- */}
              {isOwnProfile && (
                <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">My Bookmarks</h2>
                  <p className="text-gray-500">
                    {/* TODO: Add list of bookmarked resources/posts */}
                    You have no bookmarked items.
                  </p>
                </div>
              )}

            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

// A helper component for the stat cards
function StatCard({ title, value, icon: Icon }: { title: string, value: number, icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-5 flex items-center">
      <div className="bg-indigo-100 rounded-full p-3 mr-4">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}