import type { Database as DB } from "./lib/database.types";

declare global {
  type Survey = DB["public"]["Tables"]["forms"]["Row"];
}

export interface AppRouteContext {
  header: {
    showAuthButtons?: boolean;
    showCreateSurvey?: boolean;
    showLogout?: boolean;
  };
}
