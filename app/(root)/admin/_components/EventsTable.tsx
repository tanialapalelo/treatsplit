"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminUpdateEvent, adminDeleteEvent } from "@/lib/actions/admin/events";
import { AdminEventRow } from "@/lib/types/shared.types";

type Props = {
  currentUserId: string;
  events: AdminEventRow[];
};

export default function EventsTable({ currentUserId, events: initialEvents }: Props) {
  const [events, setEvents] = useState<AdminEventRow[]>(initialEvents);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async (eventId: string, field: keyof AdminEventRow, value: string) => {
    try {
      await adminUpdateEvent(currentUserId, eventId, { [field]: value } as any);
      setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, [field]: value } : e)));
      toast.success("Event updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteEvent(currentUserId, deleteId);
      setEvents((prev) => prev.filter((e) => e.id !== deleteId));
      toast.success("Event deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="overflow-x-auto space-y-3">
      {events.map((e) => (
        <div key={e.id} className="flex gap-2 items-center border rounded p-2">
          <Input
            defaultValue={e.title}
            onBlur={(ev) => handleSave(e.id, "title", ev.target.value)}
            className="max-w-xs"
          />
          <Input
            type="date"
            defaultValue={e.date}
            onBlur={(ev) => handleSave(e.id, "date", ev.target.value)}
          />
          <select
            defaultValue={e.status}
            onBlur={(ev) => handleSave(e.id, "status", ev.target.value)}
            className="border p-1 rounded"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="text-xs text-muted-foreground ml-auto">
            {e.teams?.name ?? "No team"}
          </div>
          <Button variant="destructive" size="sm" onClick={() => setDeleteId(e.id)}>
            Delete
          </Button>
        </div>
      ))}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this event?</DialogTitle>
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
