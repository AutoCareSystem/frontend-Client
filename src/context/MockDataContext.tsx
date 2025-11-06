import React, { createContext, useContext, useState } from 'react';

export type Service = {
  id: number;
  title: string;
  customer: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Completed';
};

export type Appointment = {
  id: number;
  title: string;
  customer: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Completed';
};

export type Project = {
  id: number;
  title: string;
  customer: string;
  status: 'Pending' | 'Approved' | 'Completed';
  due?: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'customer' | 'manager' | string;
  isActive: boolean;
};

type MockContext = {
  services: Service[];
  appointments: Appointment[];
  projects: Project[];
  users: User[];
  addService: (s: Omit<Service, 'id'>) => Service;
  toggleUserActive?: (id: number) => void;
};

const DefaultContext: MockContext = {
  services: [],
  appointments: [],
  projects: [],
  users: [],
  addService: () => { throw new Error('MockDataProvider not mounted'); },
  toggleUserActive: () => {},
};

const ctx = createContext<MockContext>(DefaultContext);

export const useMockData = () => useContext(ctx);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([
    { id: 201, title: 'Full Car Service', customer: 'Kevin Perera', date: '2025-11-12T09:00:00Z', status: 'Approved' },
    { id: 202, title: 'Interior Cleaning', customer: 'Sara Lee', date: '2025-11-15T10:00:00Z', status: 'Pending' },
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Michael Roberts', email: 'michael.roberts@example.com', role: 'employee', isActive: true },
    { id: 2, name: 'Aisha Khan', email: 'aisha.khan@example.com', role: 'employee', isActive: true },
    { id: 3, name: 'Daniel Lee', email: 'daniel.lee@example.com', role: 'manager', isActive: true },
    { id: 4, name: 'Priya Nair', email: 'priya.nair@example.com', role: 'employee', isActive: false },
    { id: 5, name: 'Samuel Green', email: 'sam.green@example.com', role: 'customer', isActive: true },
    { id: 6, name: 'Olivia Brown', email: 'olivia.brown@example.com', role: 'employee', isActive: true },
    { id: 7, name: 'Noah Wilson', email: 'noah.wilson@example.com', role: 'employee', isActive: false },
    { id: 8, name: 'Emma Davis', email: 'emma.davis@example.com', role: 'admin', isActive: true },
    { id: 9, name: 'Liam Johnson', email: 'liam.johnson@example.com', role: 'employee', isActive: true },
    { id: 10, name: 'Sophia Martinez', email: 'sophia.martinez@example.com', role: 'employee', isActive: true },
  ]);

  const [appointments] = useState<Appointment[]>([
    { id: 101, title: 'Full Car Service', customer: 'Kevin Perera', date: '2025-11-12T09:00:00Z', status: 'Approved' },
    { id: 102, title: 'Brake Inspection', customer: 'Sarah Fernando', date: '2025-11-13T11:00:00Z', status: 'Pending' },
    { id: 103, title: 'Engine Diagnostics', customer: 'John Doe', date: '2025-11-14T14:00:00Z', status: 'Approved' },
  ]);

  const [projects] = useState<Project[]>([
    { id: 1, title: 'Engine Overhaul - Project A', customer: 'John Doe', status: 'Approved', due: '2025-11-05' },
    { id: 2, title: 'Paint & Polish - Job 12', customer: 'Acme Corp', status: 'Pending', due: '2025-11-10' },
    { id: 3, title: 'Brake Replacement', customer: 'Sarah Fernando', status: 'Approved', due: '2025-11-02' },
  ]);

  function toggleUserActive(id: number) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  }

  function addService(s: Omit<Service, 'id'>) {
    const id = Math.max(0, ...services.map(x => x.id)) + 1;
    const newS: Service = { id, ...s };
    setServices(prev => [newS, ...prev]);
    return newS;
  }

  return (
    <ctx.Provider value={{ services, appointments, projects, users, addService, toggleUserActive }}>
      {children}
    </ctx.Provider>
  );
}
