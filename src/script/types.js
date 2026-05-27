
class Task {
    constructor(name, description, start_time, end_time, tags) {
        this.name = name;
        this.description = description;
        this.start_time = start_time;
        this.end_time = end_time;
        this.tags = tags;
    }

}

/*
export interface PuzzleCheckResult {
    correct: boolean;
    points_awarded: number;
    next_hint: Hint;
}

export interface Puzzle {
    valid: boolean;
    node_id: string;
    puzzleID: number;
    puzzleLevel: number;
    question: string;
    choices: string[]; //Antwortoptionen
}

export interface User {
    userID: string;
    username: string;
    currentScore: number;
    lastVisitedCheckpointID: string; //egal ob besucht oder unbesucht
    lastFailedAttempt: number; //als timestamp
    completedChallenges: string[];
    activePuzzleID: string;
    activePuzzleLevel: number;
}
 */