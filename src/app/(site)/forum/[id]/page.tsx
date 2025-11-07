import ForumThreadClient from "./ForumThreadClient";

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default function ForumThreadPage({
  params,
}: {
  params: { id: string };
}) {
  return <ForumThreadClient id={params.id} />;
}
