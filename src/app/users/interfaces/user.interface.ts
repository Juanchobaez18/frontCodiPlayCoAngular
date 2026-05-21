export interface RoleInterface {
    id: number;
    name: string;
}

export interface UserInterface {
    id: number;
    name: string; 
    lastName: string;
    email: string;
    isActive: boolean;
    avatar: string;
    roles: RoleInterface[];
}