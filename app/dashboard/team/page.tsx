import { fetchTeamMembers, fetchRoles } from "@/app/lib/data";
import TeamTable from "@/app/ui/team/table";
import { AddMember } from "@/app/ui/team/buttons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
};

export default async function Page() {
  const [members, roles] = await Promise.all([
    fetchTeamMembers(),
    fetchRoles(),
  ]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-8">
        <AddMember />
      </div>
      <TeamTable members={members} roles={roles} />
    </div>
  );
}
