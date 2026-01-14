import { db } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";

export const SyncService = {
    /**
     * Syncs all unsynced assessments from local Dexie DB to Supabase.
     * Returns the count of successfully synced records.
     */
    async syncData(): Promise<number> {
        // Check internet connection
        if (!navigator.onLine) {
            throw new Error("No internet connection");
        }

        // Check if user is authenticated
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) {
            throw new Error("Not authenticated. Please log in to sync.");
        }

        // 1. Get all unsynced records
        const unsyncedAssessments = await db.assessments
            .filter((a) => !a.isSynced)
            .toArray();

        if (unsyncedAssessments.length === 0) {
            return 0;
        }

        // 2. Prepare data for Supabase
        const recordsToInsert = unsyncedAssessments.map((a) => ({
            id: a.id,
            user_id: session.user.id, // Associate with logged-in user
            total_score: a.riskScore,
            risk_level: a.riskLevel,
            symptoms: {
                selected: a.symptoms,
                notes: a.notes ?? null,
            },
            created_at: new Date(a.timestamp).toISOString(),
        }));

        // 3. Batch insert into Supabase
        const { error } = await supabase
            .from("assessments")
            .upsert(recordsToInsert as any, { onConflict: "id" });

        if (error) {
            console.error("Supabase sync error:", error);
            throw new Error(`Sync failed: ${error.message}`);
        }

        // 4. Update local records to synced = true
        const updatedRecords = unsyncedAssessments.map((a) => ({
            ...a,
            isSynced: true,
        }));

        await db.assessments.bulkPut(updatedRecords);

        return unsyncedAssessments.length;
    },
};
