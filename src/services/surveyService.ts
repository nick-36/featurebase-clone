import supabase from "@/config/supabaseClient";

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

export const getSurveyById = async (id: string): Promise<Survey> => {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Survey;
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
    .rpc("increment_visit_count", { survey_url: surveyUrl })
    .single();

  if (error || !data) {
    console.error("Error fetching survey via RPC:", error);
    throw error || new Error("Survey not found");
  }

  return data;
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

  console.log(data, "DATA__");
  if (error || !data) throw new Error("Survey not found");
  return data;
}
