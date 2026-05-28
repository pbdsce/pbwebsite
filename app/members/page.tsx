import Members from "@/components/members/Members";
import { getAllMembers } from "@/lib/server/members";
import connectDB from "@/lib/db/connection";

export const metadata = {
  title: "Members",
};
export default async function Events() {
  await connectDB();
  const allMembers = await getAllMembers();

  const members = JSON.parse(JSON.stringify(allMembers));

  return (
    <section className="w-full h-full" id="members">
      <Members members={members} />
    </section>
  );
}
