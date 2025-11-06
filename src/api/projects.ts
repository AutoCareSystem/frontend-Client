export type ProjectDto = {
  appointmentId?: number;
  id?: number;
  projectTitle?: string;
  projectDescription?: string | null;
  start?: string;
  end?: string;
  customerName?: string;
  status?: string;
};

const MOCK_PROJECTS: ProjectDto[] = [
  { id: 1, projectTitle: 'Engine Overhaul - Project A', projectDescription: 'Full engine rebuild', start: '2025-10-20', end: '2025-11-05', customerName: 'John Doe', status: 'Approved' },
  { id: 2, projectTitle: 'Paint & Polish - Job 12', projectDescription: 'Full exterior paint and polish', start: '2025-10-25', end: '2025-11-10', customerName: 'Acme Corp', status: 'Pending' },
  { id: 3, projectTitle: 'Brake Replacement', projectDescription: 'Replace front and rear brakes', start: '2025-11-01', end: '2025-11-02', customerName: 'Sarah Fernando', status: 'Approved' },
];

export async function fetchProjects(): Promise<ProjectDto[]> {
  return Promise.resolve(MOCK_PROJECTS.map(p => ({ ...p })));
}
