"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

const UserAvatar = () => {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return null;

  const name = user.user_metadata?.name || user.email;
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
      {initials}
    </div>
  );
};

export default UserAvatar;
