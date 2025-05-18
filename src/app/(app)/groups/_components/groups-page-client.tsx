"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLensGroups } from "@/hooks/use-lens-groups";
import { useIsMobile } from "@/hooks/use-mobile";
import { Group } from "@lens-protocol/client";
import { CheckCircle2, PlusIcon, ShieldAlert, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function GroupsPageClient({ groups }: { groups: Group[] }) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("all");
  const router = useRouter();
  const { createGroup, isGroupMember } = useLensGroups();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  // Filter groups based on active tab
  const filteredGroups =
    activeTab === "all" ? groups : groups.filter((g) => !g.membershipApprovalEnabled);

  const handleCreateGroup = async () => {
    if (!groupName) {
      toast.error("Group name is required");
      return;
    }

    setIsCreating(true);
    try {
      const groupId = await createGroup(groupName, groupDescription);

      if (groupId) {
        toast.success("Group created successfully!");
        setIsDialogOpen(false);
        // Reset form
        setGroupName("");
        setGroupDescription("");
        // Navigate to the new group page after a short delay
        setTimeout(() => {
          router.push(`/groups/${groupId}`);
        }, 500);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  const CreateGroupDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90">
          <PlusIcon className="mr-2 size-4" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new group</DialogTitle>
          <DialogDescription>
            Create a group for believers to support and discuss projects together.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="col-span-4">
              Group Name
            </Label>
            <Input
              id="name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="col-span-4"
              placeholder="Enter group name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="col-span-4">
              Description
            </Label>
            <Textarea
              id="description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="col-span-4"
              placeholder="Describe what this group is about"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleCreateGroup}
            disabled={isCreating}
            className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
          >
            {isCreating ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (groups.length === 0) {
    return (
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-bold text-3xl">Believers Groups</h1>
            <p className="mt-1 text-muted-foreground">
              Join groups of like-minded believers supporting creators
            </p>
          </div>
          <CreateGroupDialog />
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border p-12 text-center">
          <h3 className="mb-1 font-semibold text-xl">No groups found</h3>
          <p className="mb-4 text-muted-foreground">Be the first to create a group</p>
          <Button
            className="bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon className="mr-2 size-4" />
            Create Group
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-bold text-3xl">Believers Groups</h1>
          <p className="mt-1 text-muted-foreground">
            Join groups of like-minded believers supporting creators
          </p>
        </div>
        <CreateGroupDialog />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <TabsList className={isMobile ? "grid w-full grid-cols-2" : ""}>
            <TabsTrigger value="all">All Groups</TabsTrigger>
            <TabsTrigger value="public">Public Only</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => {
              const member = isGroupMember(group);
              const canJoin =
                group.operations?.canJoin?.__typename === "GroupOperationValidationPassed";

              return (
                <Card key={group.address} className="overflow-hidden">
                  {group.metadata?.icon && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={group.metadata.icon}
                        alt={group.metadata?.name || "Group"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{group.metadata?.name || "Untitled Group"}</CardTitle>
                      <div className="flex items-center gap-1">
                        {member && (
                          <div className="flex items-center rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs">
                            <CheckCircle2 className="mr-1 size-3" />
                            Member
                          </div>
                        )}
                        {group.membershipApprovalEnabled && (
                          <div className="flex items-center rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-800 text-xs">
                            <ShieldAlert className="mr-1 size-3" />
                            Private
                          </div>
                        )}
                      </div>
                    </div>
                    <CardDescription>{group.metadata?.description || ""}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <UsersIcon className="mr-2 size-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {/* Member count fetch would go here */}
                        Members
                      </span>
                    </div>
                    {!canJoin &&
                      !member &&
                      group.operations?.canJoin?.__typename ===
                        "GroupOperationValidationFailed" && (
                        <p className="mt-2 text-red-500 text-xs">
                          {group.operations.canJoin.reason}
                        </p>
                      )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => router.push(`/groups/${group.address}`)}
                    >
                      {member ? "View Group" : "Details"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
