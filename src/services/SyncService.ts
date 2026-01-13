import { db } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";

export const SyncService = {
    /**
     * Syncs all unsynced assessments from local Dexie DB to Supabase.
     * Returns the count of successfully synced records.
     */
    async syncData(): Promise<number> {
        if (!navigator.onLine) {
            throw new Error("No internet connection");
        }

        // 1. Get all unsynced records
        const unsyncedAssessments = await db.assessments
            .filter((a) => !a.isSynced)
            .toArray();

        if (unsyncedAssessments.length === 0) {
            return 0;
        }

        (`Found ${unsyncedAssessments.length} unsynced records.`);

        // 2. Prepare data for Supabase
        // Note: We map the local fields to match the Supabase table structure if needed.
        // Based on previous Dashboard code, it seems the structure is assumed compatible or mapped inline.
        // Let's map it safely.
        const recordsToInsert = unsyncedAssessments.map((a) => ({
            id: a.id,
            total_score: a.riskScore,
            risk_level: a.riskLevel,
            symptoms: {
                selected: a.symptoms,
                notes: a.notes ?? null,
            }, // JSONB column
            created_at: new Date(a.timestamp).toISOString(),
        }));

        // 3. Batch insert into Supabase
        const { error } = await supabase
            .from("assessments")
            .upsert(recordsToInsert as any, { onConflict: "id" }); // using upsert to be safe

        if (error) {
            throw new Error(`Sync failed: ${error.message}`);
        }


        // 4. Update local records to synced = true
        // We do this in a transaction or just loop for now.
        // Bulk put/update is efficient.
        const updatedRecords = unsyncedAssessments.map((a) => ({
            ...a,
            isSynced: true,
        }));

        await db.assessments.bulkPut(updatedRecords);

        return unsyncedAssessments.length;
    },
};
