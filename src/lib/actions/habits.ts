"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Get all habits for the current user with today's completion status
export async function getHabits() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Fetch habits with today's log status
    const { data: habits, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        return { error: error.message, data: null };
    }

    // Get today's logs for all habits
    const habitIds = habits.map((h) => h.id);
    const { data: todaysLogs } = await supabase
        .from("habit_logs")
        .select("habit_id")
        .eq("user_id", user.id)
        .eq("date", today);

    const completedToday = new Set(todaysLogs?.map((l) => l.habit_id) || []);

    // Add completion status to each habit
    const habitsWithStatus = habits.map((habit) => ({
        ...habit,
        completedToday: completedToday.has(habit.id),
    }));

    return { error: null, data: habitsWithStatus };
}

// Create a new habit
export async function createHabit(formData: {
    name: string;
    description?: string;
    frequency: "daily" | "weekly";
    categoryId?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const { data, error } = await supabase
        .from("habits")
        .insert({
            user_id: user.id,
            name: formData.name,
            description: formData.description || null,
            frequency: formData.frequency,
            category_id: formData.categoryId || null,
        })
        .select()
        .single();

    if (error) {
        return { error: error.message, success: false, data: null };
    }

    revalidatePath("/dashboard/habits");
    revalidatePath("/dashboard");
    return { error: null, success: true, data };
}

// Update a habit
export async function updateHabit(
    id: string,
    formData: {
        name?: string;
        description?: string;
        frequency?: "daily" | "weekly";
        categoryId?: string;
    }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const { error } = await supabase
        .from("habits")
        .update({
            name: formData.name,
            description: formData.description,
            frequency: formData.frequency,
            category_id: formData.categoryId,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message, success: false };
    }

    revalidatePath("/dashboard/habits");
    return { error: null, success: true };
}

// Delete a habit
export async function deleteHabit(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message, success: false };
    }

    revalidatePath("/dashboard/habits");
    revalidatePath("/dashboard");
    return { error: null, success: true };
}

// Log habit completion for today
export async function logHabit(habitId: string, notes?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("habit_logs").insert({
        habit_id: habitId,
        user_id: user.id,
        date: today,
        completed: true,
        notes: notes || null,
    });

    if (error) {
        return { error: error.message, success: false };
    }

    revalidatePath("/dashboard/habits");
    revalidatePath("/dashboard");
    return { error: null, success: true };
}

// Remove today's log for a habit
export async function unlogHabit(habitId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habitId)
        .eq("user_id", user.id)
        .eq("date", today);

    if (error) {
        return { error: error.message, success: false };
    }

    revalidatePath("/dashboard/habits");
    revalidatePath("/dashboard");
    return { error: null, success: true };
}

// Get habit stats (streaks, completion rate)
export async function getHabitStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    // Get all habits
    const { data: habits } = await supabase
        .from("habits")
        .select("id, name, frequency, created_at")
        .eq("user_id", user.id);

    if (!habits || habits.length === 0) {
        return {
            error: null,
            data: {
                totalHabits: 0,
                completedToday: 0,
                longestStreak: 0,
                averageCompletion: 0,
            },
        };
    }

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Get today's completions
    const { data: todaysLogs } = await supabase
        .from("habit_logs")
        .select("habit_id")
        .eq("user_id", user.id)
        .eq("date", today);

    const completedToday = new Set(todaysLogs?.map((l) => l.habit_id) || []);

    // Get all logs for the last 30 days for completion rate
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentLogs } = await supabase
        .from("habit_logs")
        .select("habit_id, date")
        .eq("user_id", user.id)
        .gte("date", thirtyDaysAgo.toISOString().split("T")[0]);

    // Calculate completion rate (logs / expected completions)
    const totalExpected = habits.length * 30; // Simplified: all daily for 30 days
    const totalCompleted = recentLogs?.length || 0;
    const averageCompletion = totalExpected > 0
        ? Math.round((totalCompleted / totalExpected) * 100)
        : 0;

    // Calculate longest current streak
    let longestStreak = 0;
    for (const habit of habits) {
        const streak = await calculateStreak(supabase, user.id, habit.id);
        if (streak > longestStreak) {
            longestStreak = streak;
        }
    }

    return {
        error: null,
        data: {
            totalHabits: habits.length,
            completedToday: completedToday.size,
            longestStreak,
            averageCompletion,
        },
    };
}

// Helper function to calculate current streak for a habit
async function calculateStreak(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, habitId: string): Promise<number> {
    const { data: logs } = await supabase
        .from("habit_logs")
        .select("date")
        .eq("user_id", userId)
        .eq("habit_id", habitId)
        .order("date", { ascending: false })
        .limit(100);

    if (!logs || logs.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get unique dates
    const logDates = [...new Set(logs.map((l) => l.date))];

    for (let i = 0; i < logDates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        const expectedDateStr = expectedDate.toISOString().split("T")[0];

        if (logDates.includes(expectedDateStr)) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

// Get habit consistency data (aggregated completion across all habits per day)
export async function getHabitConsistency(days: number = 90) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    // Get all habits
    const { data: habits } = await supabase
        .from("habits")
        .select("id, created_at")
        .eq("user_id", user.id);

    if (!habits || habits.length === 0) {
        return { error: null, data: [] };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all logs in the period
    const { data: logs, error } = await supabase
        .from("habit_logs")
        .select("habit_id, date")
        .eq("user_id", user.id)
        .gte("date", startDate.toISOString().split("T")[0]);

    if (error) {
        return { error: error.message, data: null };
    }

    // Group logs by date
    const logsByDate: Record<string, Set<string>> = {};
    for (const log of logs || []) {
        const dateStr = log.date;
        if (!logsByDate[dateStr]) {
            logsByDate[dateStr] = new Set();
        }
        logsByDate[dateStr].add(log.habit_id);
    }

    // Generate consistency data for each day
    const consistencyData = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        // Count habits that existed on this date
        const activeHabits = habits.filter(h => {
            const createdDate = h.created_at.split("T")[0];
            return createdDate <= dateStr;
        });

        const completedCount = logsByDate[dateStr]?.size || 0;
        const totalHabits = activeHabits.length;
        const percentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

        consistencyData.push({
            date: dateStr,
            completed: completedCount,
            total: totalHabits,
            percentage,
            dayOfWeek: date.getDay(),
            week: Math.floor(i / 7),
        });
    }

    return { error: null, data: consistencyData };
}
