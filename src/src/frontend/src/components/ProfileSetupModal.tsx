import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSaveCallerUserProfile } from "../hooks/useQueries";
import { toast } from "sonner";
import type { UserProfile } from "../backend";

export default function ProfileSetupModal() {
  const [name, setName] = useState("");
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const newProfile: UserProfile = {
      name: name.trim(),
      score: {
        overall: 0,
        calculatedOnDfinity: 0,
        calculatedOnOpenAi: 0,
      },
      stats: {
        totalDebates: BigInt(0),
        winRate: 0,
        strongestCategory: "",
        weakestCategory: "",
      },
      debateHistory: [],
    };

    saveProfile(newProfile, {
      onSuccess: () => {
        toast.success("Profile created successfully!");
      },
      onError: (error) => {
        toast.error("Failed to create profile");
        console.error(error);
      },
    });
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Welcome to DebateAI</DialogTitle>
          <DialogDescription>
            Let's get you set up. What should we call you?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating Profile..." : "Get Started"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
