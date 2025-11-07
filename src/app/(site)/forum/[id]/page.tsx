// app/(site)/forum/[id]/page.tsx
import ForumThreadClient from "./ForumThreadClient";

// ✅ Required for static export
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

// ✅ Server component — passes `params` to client part
export default function ForumThreadPage({ params }: { params: { id: string } }) {
  return <ForumThreadClient id={params.id} />;
}
