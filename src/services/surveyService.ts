import supabase from "@/config/supabaseClient";
import { isQuestionElement } from "@/lib/utils";
import { FormElementInstance } from "@/types/formElement";

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

export async function getSurveyStats() {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("forms")
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

export async function getSurveys(): Promise<Survey[]> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
export const getSurveyById = async (
  id: string
): Promise<
  Survey & {
    submissionRate: number;
    bounceRate: number;
  }
> => {
  const { data: form, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !form) throw error ?? new Error("Survey not found");

  const visits = Math.max(0, form.visits ?? 0);
  const submissions = Math.max(0, form.submissions ?? 0);

  let submissionRate = 0;
  let bounceRate = 100;

  if (visits > 0) {
    const safeSubmissions = Math.min(submissions, visits);
    submissionRate = (safeSubmissions / visits) * 100;
    bounceRate = 100 - submissionRate;
  }

  bounceRate = Math.max(0, Math.min(100, bounceRate));
  submissionRate = Math.max(0, Math.min(100, submissionRate));

  return {
    ...form,
    submissionRate: parseFloat(submissionRate.toFixed(2)),
    bounceRate: parseFloat(bounceRate.toFixed(2)),
  };
};

export const createSurvey = async (
  payload: Partial<Survey>
): Promise<Survey> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("forms")
    .insert([{ ...payload, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data as Survey;
};

export async function updateSurveyContent(id: string, jsonContent: string) {
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("forms")
    .update({ content: jsonContent })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error("Error updating form content");
}

export async function publishForm(id: string) {
  const user = await getCurrentUser();

  const { data: form, error: fetchError } = await supabase
    .from("forms")
    .select("content")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !form) {
    throw new Error("Error publishing form");
  }
  let content: FormElementInstance[];

  try {
    content = JSON.parse(form.content as string);
  } catch (err) {
    throw new Error("Failed to parse form content.");
  }

  if (!Array.isArray(content)) {
    throw new Error("Survey content is invalid or empty.");
  }

  const typedContent = content as FormElementInstance[];

  const hasQuestions = typedContent.some((el) => isQuestionElement(el.type));

  if (!hasQuestions) {
    throw new Error(
      "Survey must contain at least one question before publishing."
    );
  }

  const { error } = await supabase
    .from("forms")
    .update({ published: true })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Error publishing form");
  }
}

export async function getSurveyByFormURL(surveyUrl: string) {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("share_url", surveyUrl)
    .single();

  if (error || !data) throw error;

  return data;
}

export async function trackUniqueFormVisit(surveyUrl: string) {
  try {
    await supabase.rpc("increment_visit_count", { survey_url: surveyUrl });
  } catch (error) {
    console.error("Error incrementing visit count:", error);
  }
}

export async function submitSurvey(surveyUrl: string, content: string) {
  const { data: form, error: fetchError } = await supabase
    .from("forms")
    .select("id, submissions")
    .eq("share_url", surveyUrl)
    .eq("published", true)
    .single();

  if (fetchError || !form) throw fetchError ?? new Error("Survey not found");

  const { error: formError } = await supabase
    .from("forms")
    .update({ submissions: form.submissions + 1 })
    .eq("share_url", surveyUrl)
    .eq("published", true);

  if (formError) throw new Error("Error submitting form");

  const { error: submissionError } = await supabase
    .from("form_submission")
    .insert({ content, form_id: form.id });

  if (submissionError) throw new Error("Error storing submission");
  return { success: true };
}

export async function getSurveysWithSubmissions(id: string) {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("forms")
    .select("*, form_submission(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) throw new Error("Survey not found");
  return data;
}

export async function fetchSurveysPaginated(page: number, pageSize = 6) {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const { data, error } = await supabase
    .from("forms")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    surveys: data ?? [],
    hasMore: (data?.length ?? 0) === pageSize,
  };
}

export const unpublishSurvey = async ({ surveyId }: { surveyId: string }) => {
  const { data, error } = await supabase
    .from("forms")
    .update({ published: false })
    .eq("id", surveyId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
