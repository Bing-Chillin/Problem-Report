export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role_id: number;
  role?: {
    id: number;
    name: string;
  };
}

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getUserRole = (): string | null => {
  const user = getCurrentUser();
  return user?.role?.name || null;
};

export const hasRole = (roleName: string): boolean => {
  const userRole = getUserRole();
  return userRole === roleName;
};

export const isAdmin = (): boolean => {
  return hasRole("admin");
};

export const isDeveloper = (): boolean => {
  return hasRole("developer");
};

export const isDispatcher = (): boolean => {
  return hasRole("dispatcher");
};

export const isUser = (): boolean => {
  return hasRole("user");
};

export const canDeleteReports = (): boolean => {
  return isAdmin() || isUser();
};

export const canViewAllReports = (): boolean => {
  return isAdmin() || isDeveloper() || isDispatcher();
};

export const canModifyReportStatus = (): boolean => {
  return isAdmin() || isDeveloper() || isDispatcher();
};

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem("token") && !!getCurrentUser();
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/";
};
