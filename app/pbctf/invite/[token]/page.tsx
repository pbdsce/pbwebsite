import connectDB from "@/lib/db/connection";
import TeamInvite from "@/lib/db/models/TeamInvite";
import AcceptInviteForm from "@/components/forms/pbctfForm/AcceptInviteForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    token: string;
  };
}

export default async function InvitePage({
  params,
}: PageProps) {

  const { token } = params;

  let invite = null;

  try {

    await connectDB();

    invite = await TeamInvite.findOne({
      token,
    });

  } catch (err) {

    console.error("INVITE PAGE ERROR:", err);

  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        Invalid or expired invite
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-black text-green-400 p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl mb-4">
          Accept PBCTF Invite
        </h1>

        <p className="mb-8 text-gray-400">
          Invited as: {invite.email}
        </p>

        <AcceptInviteForm
          token={token}
          invitedEmail={invite.email}
        />

      </div>

    </div>

  );
}