import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Member",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Team", href: "/dashboard/team" },
          {
            label: "Edit Member",
            href: `/dashboard/team/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <p className="text-gray-500">Edit member form coming soon...</p>
      </div>
    </main>
  );
}
