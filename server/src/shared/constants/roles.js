export const ROLES = ["super_admin", "system_admin", "client_admin", "client_viewer"];

export const CLIENT_ROLES = ["client_admin", "client_viewer"];

export const APPLICATION_ROLES = {
    SUPER_ADMIN: "super_admin",
    SYSTEM_ADMIN: "system_admin",
    CLIENT_ADMIN: "client_admin",
    CLIENT_VIEWER: "client_viewer",
};

export const isValidClientRole = (role) => CLIENT_ROLES.includes(role);
export const isValidRole = (role) => ROLES.includes(role);
