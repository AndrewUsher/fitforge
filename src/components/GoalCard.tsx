import type { Goal } from '@/lib/supabase/types'

interface GoalCardProps {
    goal: Goal
}

export default function GoalCard({ goal }: GoalCardProps) {
    return (
        <div className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                    <div className="mt-2 text-sm">
                        <span className="text-gray-600">Progress: </span>
                        <span className="font-medium">
                            {goal.current_value} / {goal.target_value} {goal.unit}
                        </span>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    {goal.completed ? (
                        <span className="text-green-600">Completed</span>
                    ) : (
                        <span>In Progress</span>
                    )}
                </div>
            </div>
        </div>
    )
} 