import Lore from "@/components/lore/Lore";
import LoreType from "@/types/lore/loreType";
import { getAllLores } from "@/lib/server/lore";
import connectDB from "@/lib/db/connection";

export const metadata = {
  title: "Lore",
};

export default async function LorePage() {
  await connectDB();
  const data = await getAllLores();
  const lores: LoreType[] = JSON.parse(JSON.stringify(data));
  lores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="w-full h-full">
      <Lore lores={lores} />
    </section>
  );
}
