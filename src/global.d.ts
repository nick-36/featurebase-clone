import type { Database as DB } from "./types/supabase";

declare global {
  type Survey = DB["public"]["Tables"]["forms"]["Row"];
  type SurveySubmission = DB["public"]["Tables"]["form_submission"]["Row"];
  type ApiError = {
    code: string;
    message: string;
  };
}

export interface AppRouteContext {
  header: {
    showAuthButtons?: boolean;
    hideHeader?: boolean;
  };
}
