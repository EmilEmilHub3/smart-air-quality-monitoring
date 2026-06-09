export declare enum UserRole {
    User = "user",
    Admin = "admin"
}
export declare class User {
    id: number;
    email: string;
    passwordHash: string;
    role: UserRole;
}
