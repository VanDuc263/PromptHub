import type { PromptEditorMetadata, PromptVariable } from "@/types";

export interface CreatePromptPayload {
  metadata: PromptEditorMetadata;
  content: string;
  systemMessage: string;
  variables: PromptVariable[];
  notes: string;
  publish: boolean;
}

export interface CreatePromptResult {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  version: string;
}

export interface PromptEditorApi {
  id: string;
  title: string;
  description: string;
  category: string;
  visibility: "Private" | "Public";
  model: string;
  language: string;
  tags: string[];
  content: string;
  systemMessage: string;
  variables: Array<Omit<PromptVariable, "id">>;
  notes: string;
  status: "DRAFT" | "PUBLISHED";
}

async function readPromptError(response: Response, fallback: string) {
  try {
    const body = await response.json() as { detail?: string; message?: string };
    return body.detail ?? body.message ?? fallback;
  } catch {
    return fallback;
  }
}

export async function createPromptRequest(payload: CreatePromptPayload, accessToken: string) {
  let response: Response;
  try {
    response = await fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({
        title: payload.metadata.title,
        description: payload.metadata.description,
        visibility: payload.metadata.visibility,
        model: payload.metadata.model,
        language: payload.metadata.language,
        tags: payload.metadata.tags,
        content: payload.content,
        systemMessage: payload.systemMessage,
        variables: payload.variables.map((variable) => ({
          name: variable.name,
          label: variable.label,
          type: variable.type,
          required: variable.required,
          placeholder: variable.placeholder,
          options: variable.options,
        })),
        notes: payload.notes,
        publish: payload.publish,
      }),
    });
  } catch {
    throw new Error("Could not connect to PromptHub.");
  }

  if (!response.ok) {
    let message = `Could not create prompt (${response.status}).`;
    try {
      const body = await response.json() as { detail?: string; message?: string };
      message = body.detail ?? body.message ?? message;
    } catch { /* use the status message */ }
    throw new Error(message);
  }
  return response.json() as Promise<CreatePromptResult>;
}

export async function fetchPromptEditorRequest(promptId: string, accessToken: string) {
  const response = await fetch(`/api/prompts/${encodeURIComponent(promptId)}/editor`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(await readPromptError(response, `Could not load prompt (${response.status}).`));
  return response.json() as Promise<PromptEditorApi>;
}

export async function updatePromptRequest(promptId: string, payload: CreatePromptPayload, accessToken: string) {
  const response = await fetch(`/api/prompts/${encodeURIComponent(promptId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      title: payload.metadata.title,
      description: payload.metadata.description,
      visibility: payload.metadata.visibility,
      model: payload.metadata.model,
      language: payload.metadata.language,
      tags: payload.metadata.tags,
      content: payload.content,
      systemMessage: payload.systemMessage,
      variables: payload.variables.map((variable) => ({
        name: variable.name,
        label: variable.label,
        type: variable.type,
        required: variable.required,
        placeholder: variable.placeholder,
        options: variable.options,
      })),
      notes: payload.notes,
      publish: payload.publish,
    }),
  });
  if (!response.ok) throw new Error(await readPromptError(response, `Could not update prompt (${response.status}).`));
  return response.json() as Promise<CreatePromptResult>;
}
