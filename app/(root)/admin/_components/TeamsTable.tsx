"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminUpdateTeam, adminDeleteTeam } from "@/lib/actions/admin/teams";
import { AdminTeamRow } from "@/lib/types/shared.types";

type Props = {
  currentUserId: string;
  teams: AdminTeamRow[];
};

export default function TeamsTable({ currentUserId, teams: initialTeams }: Props) {
  const [teams, setTeams] = useState<AdminTeamRow[]>(initialTeams);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async (teamId: string, field: keyof AdminTeamRow, value: string) => {
    try {
      await adminUpdateTeam(currentUserId, teamId, { [field]: value } as any);
      setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, [field]: value } : t)));
      toast.success("Team updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update team");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteTeam(currentUserId, deleteId);
      setTeams((prev) => prev.filter((t) => t.id !== deleteId));
      toast.success("Team deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete team");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="overflow-x-auto space-y-3">
      {teams.map((t) => (
        <div key={t.id} className="flex gap-2 items-center border rounded p-2">
          <Input
            defaultValue={t.name}
            onBlur={(e) => handleSave(t.id, "name", e.target.value)}
            className="max-w-xs"
          />
          <select
            defaultValue={t.currency}
            onBlur={(e) => handleSave(t.id, "currency", e.target.value)}
            className="border p-1 rounded"
          >
            <option value="IDR">IDR</option>
            <option value="USD">USD</option>
          </select>
          <div className="text-xs text-muted-foreground ml-auto">{t.created_at}</div>
          <Button variant="destructive" size="sm" onClick={() => setDeleteId(t.id)}>
            Delete
          </Button>
        </div>
      ))}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this team?</DialogTitle>
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
