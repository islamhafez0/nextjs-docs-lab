import AddMemberForm from "@/app/ui/team/add-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchRoles } from "@/app/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Team Member",
};

export default async function Page() {
  const roles = await fetchRoles();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Team", href: "/dashboard/team" },
          {
            label: "Add Member",
            href: "/dashboard/team/add",
            active: true,
          },
        ]}
      />
      <AddMemberForm roles={roles} />
    </main>
  );
}
