"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLensGroups } from "@/hooks/use-lens-groups";
import { Group, GroupRuleUnsatisfiedReason } from "@lens-protocol/client";
import { ArrowLeftIcon, PlusIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function GroupPageClient({ group }: { group: Group }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("posts");
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const {
    joinGroup: joinLensGroup,
    leaveGroup: leaveLensGroup,
    isGroupMember,
  } = useLensGroups();
  const [isMember, setIsMember] = useState(false);

  // Check if the user is a member when component mounts or group changes
  useEffect(() => {
    setIsMember(isGroupMember(group));
  }, [group, isGroupMember]);

  const handleJoinGroup = async () => {
    setIsJoining(true);
    try {
      const success = await joinLensGroup(group.address);

      if (success) {
        setIsMember(true);
        toast.success("Successfully joined group!");
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join group");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveGroup = async () => {
    setIsLeaving(true);
    try {
      const success = await leaveLensGroup(group.address);

      if (success) {
        setIsMember(false);
        toast.success("Successfully left group");
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave group");
    } finally {
      setIsLeaving(false);
    }
  };

  // Check if the user can join the group according to rules
  const canJoin =
    group.operations?.canJoin?.__typename === "GroupOperationValidationPassed";
  const canLeave =
    group.operations?.canLeave?.__typename === "GroupOperationValidationPassed";

  // Handle membership approval required case
  const isApprovalRequired =
    group.operations?.canJoin?.__typename ===
      "GroupOperationValidationFailed" &&
    group.operations?.canJoin?.reason ===
      GroupRuleUnsatisfiedReason.MembershipApprovalRequired;

  return (
    <div className="container mx-auto max-w-6xl pb-12">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/groups")}
      >
        <ArrowLeftIcon className="mr-2 size-4" />
        Back to Groups
      </Button>

      {/* Hero section with group image */}
      <div className="relative mb-6 overflow-hidden rounded-xl">
        {group.metadata?.icon && (
          <div className="relative h-[200px] w-full overflow-hidden md:h-[300px]">
            <img
              src={group.metadata.icon}
              alt={group.metadata?.name || "Group"}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="font-bold text-3xl">
            {group.metadata?.name || "Untitled Group"}
          </h1>
          <div className="mt-2 flex items-center">
            <UsersIcon className="mr-2 size-4" />
            <span>{isMember ? "You are a member" : "Join this group"}</span>
          </div>
        </div>
      </div>

      {/* Group details */}
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {group.metadata?.description || ""}
              </p>
              <div className="mt-4">
                <p className="text-muted-foreground text-sm">
                  Owner: {group.owner.substring(0, 6)}...
                  {group.owner.substring(group.owner.length - 4)}
                </p>
                {group.membershipApprovalEnabled && (
                  <p className="mt-2 text-amber-600 text-sm">
                    <span className="font-medium">Private group:</span>{" "}
                    Membership requires approval
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isMember ? "Membership" : "Join Group"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isMember ? (
                <Button
                  className="w-full"
                  variant="outline"
                  disabled={isLeaving || !canLeave}
                  onClick={handleLeaveGroup}
                >
                  {isLeaving ? "Leaving..." : "Leave Group"}
                </Button>
              ) : (
                <>
                  <Button
                    className="w-full bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
                    onClick={handleJoinGroup}
                    disabled={isJoining || (!canJoin && !isApprovalRequired)}
                  >
                    {isJoining
                      ? "Joining..."
                      : isApprovalRequired
                      ? "Request to Join"
                      : "Join Group"}
                  </Button>

                  {!canJoin &&
                    !isApprovalRequired &&
                    group.operations?.canJoin?.__typename ===
                      "GroupOperationValidationFailed" && (
                      <p className="mt-2 text-red-500 text-sm">
                        {group.operations.canJoin.reason}
                      </p>
                    )}

                  {isApprovalRequired && (
                    <p className="mt-2 text-amber-600 text-sm">
                      This is a private group. Your membership request will be
                      reviewed by moderators.
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Group content tabs */}
      <Tabs
        defaultValue="posts"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="flex flex-col items-center justify-center rounded-lg border p-12 text-center">
            <h3 className="mb-1 font-semibold text-xl">No posts yet</h3>
            <p className="mb-4 text-muted-foreground">
              Be the first to post in this group
            </p>
            <Button
              className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
              disabled={!isMember}
            >
              <PlusIcon className="mr-2 size-4" />
              Create Post
            </Button>
            {!isMember && (
              <p className="mt-2 text-muted-foreground text-sm">
                You must be a member to post in this group
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="members">
          <div className="flex flex-col items-center justify-center rounded-lg border p-12 text-center">
            <h3 className="mb-1 font-semibold text-xl">
              Members feature coming soon
            </h3>
            <p className="mb-4 text-muted-foreground">
              We're working on integrating this with Lens Protocol
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
