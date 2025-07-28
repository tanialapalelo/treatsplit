"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AdminContributionRow } from "@/lib/types/shared.types";
import { adminDeleteContribution, adminUpdateContribution } from "@/lib/queries/admin/contributions";

type Props = {
  currentUserId: string;
  contributions: AdminContributionRow[];
};

export default function ContributionsTable({ currentUserId, contributions: initialContributions }: Props) {
  const [contributions, setContributions] = useState<AdminContributionRow[]>(initialContributions);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async (contributionId: string, field: keyof AdminContributionRow, value: string | boolean) => {
    try {
      await adminUpdateContribution(currentUserId, contributionId, { [field]: value } as any);
      setContributions((prev) =>
        prev.map((c) => (c.id === contributionId ? { ...c, [field]: value } : c))
      );
      toast.success("Contribution updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update contribution");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteContribution(currentUserId, deleteId);
      setContributions((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Contribution deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete contribution");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="overflow-x-auto space-y-3">
      {contributions.map((c) => (
        <div key={c.id} className="flex gap-2 items-center border rounded p-2">
          <Input
            type="number"
            defaultValue={c.amount}
            onBlur={(e) => handleSave(c.id, "amount", e.target.value)}
            className="max-w-[100px]"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={c.paid}
              onChange={(e) => handleSave(c.id, "paid", e.target.checked)}
            />
            Paid
          </label>
          <div className="text-xs text-muted-foreground ml-auto">
            {c.users?.name ?? "Unknown user"} – {c.events?.date ?? ""}
          </div>
          <Button variant="destructive" size="sm" onClick={() => setDeleteId(c.id)}>
            Delete
          </Button>
        </div>
      ))}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this contribution?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
