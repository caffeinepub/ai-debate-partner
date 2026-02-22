import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface Score {
    calculatedOnOpenAi: number;
    overall: number;
    calculatedOnDfinity: number;
}
export interface Side {
    name: string;
    display: string;
}
export interface DebateStatus {
    name: string;
    display: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Argument {
    content: string;
    timestamp: Time;
}
export interface Debate {
    status: DebateStatus;
    result: DebateResult;
    userSide: Side;
    responseLength: string;
    topic: string;
    turns: Array<Argument>;
    mode: string;
    tips: Array<string>;
    aiSide: Side;
    score: Score;
    category: string;
}
export interface DebateResult {
    overallRating: string;
}
export interface UserStats {
    weakestCategory: string;
    strongestCategory: string;
    winRate: number;
    totalDebates: bigint;
}
export interface UserProfile {
    name: string;
    score: Score;
    stats: UserStats;
    debateHistory: Array<Debate>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToDebateHistory(debate: Debate): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    fetchTopUsersByScore(limit: bigint): Promise<Array<UserProfile>>;
    fetchTopUsersByWinRate(limit: bigint): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStats(user: Principal): Promise<UserStats>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    makeHttpOutcall(url: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateDebateHistory(debateResult: DebateResult): Promise<void>;
}
