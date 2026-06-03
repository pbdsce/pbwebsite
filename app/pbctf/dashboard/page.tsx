import getCurrentUser from "@/lib/pbctf/getCurrentUser";
import { redirect } from "next/navigation";
import ChangeTeamName from "@/components/forms/pbctfForm/ChangeTeamName";
import TransferLeadership from "@/components/forms/pbctfForm/TransferLeadership";
import LeaveTeam from "@/components/forms/pbctfForm/LeaveTeam";
import SendInviteForm from "@/components/forms/pbctfForm/SendInviteForm";
import RemoveMemberButton from "@/components/forms/pbctfForm/RemoveMemberButton";
import LogoutButton from "@/components/forms/pbctfForm/Logout";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/pbctf/login");
  }
  const {registration, isLeader} = user;

  return (
    <div className="min-h-screen bg-black text-green-400 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-mono break-words">
              Welcome to PBCTF Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Team:
              {" "}
              {registration.teamName}
            </p>
          </div>
          <LogoutButton />
        </div>
        <div className="border border-green-400/20 rounded-lg p-6">
           <h2 className="text-2xl mb-4">Team Members</h2>
           <div className="space-y-4">
            <div className="border border-green-400/20 rounded p-4">
                <p className="text-xl">{registration.participant1.name}</p>
                <p className="text-gray-400">{registration.participant1.email}</p>
                <p className="text-yellow-400 mt-2">Team Leader</p>
            </div>
            {registration.participant2 && (
              <div className="border border-green-400/20 rounded p-4">
                <p className="text-lg md:text-xl break-words">{registration.participant2.name}</p>
                <p className="text-gray-400 break-all text-sm md:text-base">{registration.participant2.email}</p>
                <p className="text-blue-400 mt-2">Member</p>
              </div>
            )}
           </div>
        </div>
        {isLeader && (
          <div className="border border-green-400/20 rounded-lg p-6">
            <h2 className="text-2xl mb-4">Team Management</h2>
            <div className="flex flex-col gap-4">
                <ChangeTeamName currentTeamName={registration.teamName} />
            {registration.participant2 && (<TransferLeadership />)}
            {!registration.participant2 && (<SendInviteForm />)}
            {registration.participant2 && (<RemoveMemberButton />)}
            </div>
          </div>
        )}
        <div className="border border-red-500/20 rounded-lg p-6"><LeaveTeam/></div>
      </div>
    </div>
  );
}
