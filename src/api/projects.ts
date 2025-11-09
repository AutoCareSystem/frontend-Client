import axios from "axios";

export type ProjectDto = {
  appointmentId?: number; // backend might return appointment-based DTOs
  id?: number;
  projectTitle?: string;
  projectDescription?: string | null;
  start?: string;
  end?: string;
  CustomerName?: string;
  status?: string;
};

export async function fetchProjects(): Promise<ProjectDto[]> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5292";
  // allow alternate port commonly used by other services
  const normalized = base.replace(/\/+$/g, '');
  // try the configured base first, but client can call different backend ports if needed
  const urls = [
    `${normalized}/api/projects`,
    // fallback attempt to common alternate port where project service may run
    `${normalized.replace(/:\d+$/, '')}:5292/api/projects`,
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url);
      if (res?.data) return res.data as ProjectDto[];
    } catch (e) {
      // try next
    }
  }

  // If all attempts fail, throw so callers can fallback to local data
  throw new Error("Failed to fetch projects from backend");
}
