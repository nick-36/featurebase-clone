// lib/supabase.ts
import { BaseSurvey } from "@/types/survey";
import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SurveyResponse {
  questionId: string;
  answer: string | string[];
}

export async function getCurrentUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    throw new Error("User not authenticated");
  }

  return session.user;
}

export async function saveSurvey(survey: BaseSurvey) {
  // Get current user
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }
  // Create object to save
  const surveyToSave = {
    ...survey, // everything except pages
    user_id: user.id,
  };

  // Save to surveys table
  const { data, error } = await supabase
    .from("surveys")
    .upsert(surveyToSave)
    .select();

  if (error) {
    console.error("Error saving survey:", error);
    throw error;
  }

  return data[0];
}

// Get all surveys for current user
export async function getUserSurveys() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching surveys:", error);
    throw error;
  }

  return data as SurveyV2[];
}

// Get a specific survey by ID
export async function getSurveyById(id: string) {
  const { data: survey, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !survey) throw error ?? new Error("Survey not found");

  const visits = Math.max(0, survey.visits ?? 0);
  const submissions = Math.max(0, survey.submissions ?? 0);

  let submissionRate = 0;
  let bounceRate = 100;

  if (visits > 0) {
    const safeSubmissions = Math.min(submissions, visits);
    submissionRate = (safeSubmissions / visits) * 100;
    bounceRate = 100 - submissionRate;
  }

  bounceRate = Math.max(0, Math.min(100, bounceRate));
  submissionRate = Math.max(0, Math.min(100, submissionRate));

  if (error) {
    console.error("Error fetching survey:", error);
    throw error;
  }

  return {
    ...survey,
    submissionRate: parseFloat(submissionRate.toFixed(2)),
    bounceRate: parseFloat(bounceRate.toFixed(2)),
  };
}

//Get a survey to edit
export async function getSurveyToEdit(id: string) {
  const { data: survey, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !survey) throw error ?? new Error("Survey not found");

  return {
    ...survey,
  };
}

// Delete a survey
export async function deleteSurvey(id: string) {
  const { error } = await supabase.from("surveys").delete().eq("id", id);

  if (error) {
    console.error("Error deleting survey:", error);
    throw error;
  }

  return true;
}

export async function publishSurvey(id: string) {
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("surveys")
    .update({ is_published: true })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Error publishing form");
  }
}

export async function getSurveysWithSubmissions(id: string) {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("surveys")
    .select("*, survey_submissions(*, survey_responses(*))")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) throw new Error("Survey not found");
  return data;
}

export const createSurvey = async (
  payload: Partial<SurveyV2>
): Promise<SurveyV2> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("surveys")
    .insert([{ ...payload, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data as SurveyV2;
};

export async function getSurveyByFormURL(surveyUrl: string) {
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("share_url", surveyUrl)
    .single();

  if (error || !data) throw error;

  return data;
}

export async function saveSurveyResponses(
  surveyId: string,
  responses: SurveyResponse[]
): Promise<void> {
  // Step 1: Insert submission, let Supabase handle UUID
  const { data: insertedSubmission, error: submissionError } = await supabase
    .from("survey_submissions")
    .insert({ survey_id: surveyId, created_at: new Date().toISOString() })
    .select("id")
    .single();

  if (submissionError || !insertedSubmission) {
    throw new Error(`Failed to create submission: ${submissionError?.message}`);
  }

  const submissionId = insertedSubmission.id;

  // Step 2: Insert responses
  const responseRecords = responses.map((response) => ({
    question_id: response.questionId,
    submission_id: submissionId,
    value: JSON.stringify(response.answer),
    created_at: new Date().toISOString(),
  }));

  const { error: responsesError } = await supabase
    .from("survey_responses")
    .insert(responseRecords);

  if (responsesError) {
    throw new Error(`Failed to save responses: ${responsesError.message}`);
  }
}

export async function trackUniqueFormVisit(surveyUrl: string) {
  try {
    await supabase.rpc("increment_survey_visit_count", {
      survey_url: surveyUrl,
    });
  } catch (error) {
    console.error("Error incrementing visit count:", error);
  }
}

export async function getSurveyStats() {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("surveys")
    .select("visits, submissions")
    .eq("user_id", user.id);

  if (error || !data) throw error;

  const visits = data.reduce((acc, form) => acc + (form.visits || 0), 0);
  const submissions = data.reduce(
    (acc, form) => acc + (form.submissions || 0),
    0
  );

  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;
  const bounceRate = 100 - submissionRate;

  return { visits, submissions, submissionRate, bounceRate };
}

export const getTopSurveys = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const { data: surveys, error } = await supabase
    .from("surveys")
    .select("id, title, submissions, visits")
    .eq("user_id", user.id);

  if (error) throw error;

  const withConversion = surveys.map((survey) => ({
    ...survey,
    conversionRate:
      survey.visits > 0 ? (survey.submissions / survey.visits) * 100 : 0,
  }));

  const mostSubmissions = [...withConversion].sort(
    (a, b) => b.submissions - a.submissions
  );
  const mostVisits = [...withConversion].sort((a, b) => b.visits - a.visits);
  const highestConversion = [...withConversion].sort(
    (a, b) => b.conversionRate - a.conversionRate
  );

  return {
    mostSubmissions,
    mostVisits,
    highestConversion,
  };
};

export const unpublishSurvey = async ({ surveyId }: { surveyId: string }) => {
  const { data, error } = await supabase
    .from("surveys")
    .update({ is_published: false })
    .eq("id", surveyId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserSurveyStats = async () => {
  const user = await getCurrentUser();

  const { data, error } = await supabase.rpc("get_user_survey_stats", {
    p_user_id: user.id,
  });
  if (error) {
    throw new Error(error.message);
  }

  return data;
};
