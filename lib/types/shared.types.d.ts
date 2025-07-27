export type Currency = "IDR" | "USD";

/* ===========================
   DASHBOARD STATS
   =========================== 
*/
export interface StatsProps {
   activeEvents: number;
   activeEventsChange: string;
   totalMembers: number;
   totalMembersChange: string;
   collected: string;
   collectedChange: string;
   participation: string;
   participationChange: string;
}

/* ===========================
   PAYMENT STATS
   =========================== 
*/
export interface Participant {
   user_id: string;
   amount: number;
   paid: boolean;
   users?: { id: string; name: string };
};

export interface PaymentStatusProps {
   participants: Participant[];
   paidCount: number;
   totalAmount: number;
   collectedAmount: number;
   onTogglePaid: (userId: string) => Promise<void>;
   eventId: string;
   currency: string;
   disabled?: boolean;
};

/* ===========================
   EVENT
   =========================== 
*/
export interface EventDetailProps {
   event: any;
   contributions: any[];
   food: { id: string; title: string; votes: { user_id: string; users: { name: string } }[] }[];
   currentUserId: string;
};

export interface EventRow {
   id: string;
   date: string;
   note: string | null;
   status: string;
   teams: { name: string } | null;
   birthday_person: { name: string } | null;
};

export interface EventHistoryRow {
   id: string;
   date: string;
   note: string | null;
   status: string;
   teams: { name: string } | null;
   birthday_person: { name: string } | null;
   contributions: { amount: number; paid: boolean }[];
   food_options: { id: string; title: string; votes: { id: string }[] }[];
};
/* ===========================
   FOOD
   =========================== 
*/
export interface Food {
   id: string;
   title: string;
   votes: { user_id: string; users: { name: string } }[];
};

export interface FoodPollProps {
   foodPoll: Food[];
   userVote: string | null;
   totalVoters: number;
   onVote: (foodId: string) => Promise<void>;
   disabled?: boolean;
};
