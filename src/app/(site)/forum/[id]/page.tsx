// app/forum/[id]/page.tsx
import ForumThreadClient from "./ForumThreadClient";

export default function ForumThreadPage({
  params,
}: {
  params: { id: string };
}) {
  return <ForumThreadClient id={params.id} />;
}
