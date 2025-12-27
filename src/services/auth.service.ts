import apiClient from "@/lib/api-client";

interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      fullName: string;
    };
  };
}

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await apiClient.post<any, LoginResponse>("/auth/login", {
        email,
        password,
      });

      if (response.success) {
        localStorage.setItem("workout_token", response.data.accessToken);
        localStorage.setItem("workout_user", JSON.stringify(response.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },

  async demoLogin() {
    try {
      // If already authenticated, just verify or refresh
      if (this.isAuthenticated()) return;

      return await this.login("admin@workout.com", "admin_pass_123");
    } catch (error) {
      console.error("Demo login failed:", error);
    }
  },

  logout() {
    localStorage.removeItem("workout_token");
    localStorage.removeItem("workout_user");
    window.location.href = "/";
  },

  getUser() {
    const user = localStorage.getItem("workout_user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("workout_token");
  }
};
