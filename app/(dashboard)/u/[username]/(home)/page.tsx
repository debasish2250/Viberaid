import { syncUser } from "@/lib/auth-service";
import { getUserByUsername } from "@/lib/user-service";
import { StreamPlayer } from "@/components/stream-player";

interface CreatorPageProps {
  params: {
    username: string;
  };
}

const CreatorPage = async ({ params }: CreatorPageProps) => {
  const self = await syncUser();

  const user = await getUserByUsername(params.username);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.externalUserId !== self.externalUserId) {
    throw new Error("Unauthorized");
  }

  if (!user.stream) {
    throw new Error("Stream not found");
  }

  return (
    <div className="h-full">
      <StreamPlayer user={user} stream={user.stream} isFollowing />
    </div>
  );
};

export default CreatorPage;
