import ForumThreadClient from "./ForumThreadClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ForumThreadPage({ params }: Props) {
  const { id } = await params; // ✅ unwrap params

  return <ForumThreadClient id={id} />;
}
