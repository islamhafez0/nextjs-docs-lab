import { Role, TeamMember } from "@/app/lib/definitions";
import { lusitana } from "@/app/ui/fonts";
import { UpdateRole, ActionsDropdown } from "./buttons";

export default function TeamTable({
  members,
  roles,
}: {
  members: TeamMember[];
  roles: Role[];
}) {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Team Members
      </h1>
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* Mobile view */}
              <div className="md:hidden">
                {members?.map((member) => (
                  <div
                    key={member.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          member.role_name === "admin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.role_name || "No role"}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <UpdateRole
                        id={member.id}
                        currentRoleId={member.role_id}
                        roles={roles}
                      />
                      <ActionsDropdown id={member.id} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop view */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {members.map((member) => (
                    <tr key={member.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black sm:pl-6">
                        {member.name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {member.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            member.role_name === "admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.role_name || "No role"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <div className="flex items-center gap-3">
                          <ActionsDropdown id={member.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
