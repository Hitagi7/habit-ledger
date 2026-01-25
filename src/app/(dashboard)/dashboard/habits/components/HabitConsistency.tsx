import { getHabitConsistency } from "@/lib/actions/habits";
import HabitConsistencyGraph from "@/components/features/habits/HabitConsistencyGraph";

export default async function HabitConsistency() {
    const consistencyResult = await getHabitConsistency(90);
    const consistencyData = consistencyResult.data || [];

    if (consistencyData.length === 0) {
        return null;
    }

    return (
        <div className="delay-200 animate-fade-in-up">
            <HabitConsistencyGraph data={consistencyData} />
        </div>
    );
}
