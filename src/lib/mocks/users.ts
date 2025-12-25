import type { User } from "@/lib/types/user";

export const mockUsers: User[] = [
  {
    id: "1",
    profile: {
      nickname: "juanito",
      City: "Bogotá",
      level: "DELFIN",
      Total_points: 320,
    },
    lastName: "+57 300 111 2222",
    role: "BASIC",
    lastPaymentDate: null,
    verified: false,
    firstName: "Juan Pérez",
    email: "juan@example.com",
    blocked: false,
  },
  {
    id: "2",
    profile: {
      nickname: "maria",
      City: "Medellín",
      level: "TIBURON",
      Total_points: 820,
    },
    lastName: "+57 300 333 4444",
    role: "ADMIN",
    lastPaymentDate: "2025-11-01",
    verified: true,
    firstName: "María González",
    email: "maria@example.com",
    blocked: false,
  },
  {
    id: "3",
    profile: {
      nickname: "carolina",
      City: "Cali",
      level: "ORCA",
      Total_points: 50,
    },
    lastName: "+57 300 555 6666",
    role: "BASIC",
    lastPaymentDate: null,
    verified: false,
    firstName: "Carolina Ruiz",
    email: "caro@example.com",
    blocked: true,
  },
];

export const fetchMockUsers = async (): Promise<User[]> => {
  // Simula retraso de red
  await new Promise((r) => setTimeout(r, 250));
  // Devuelve copia para evitar mutaciones por referencia
  return JSON.parse(JSON.stringify(mockUsers));
};

export const mockActualizarPago = async (id: string): Promise<User | null> => {
  await new Promise((r) => setTimeout(r, 200));
  const today = new Date().toISOString().slice(0, 10);
  const user = mockUsers.find((u) => u.id === id);
  if (!user) return null;
  user.lastPaymentDate = today;
  return JSON.parse(JSON.stringify(user));
};

export const mockVerifyPerson = async (
  verified: boolean,
  id: string
): Promise<User | null> => {
  await new Promise((r) => setTimeout(r, 200));
  const user = mockUsers.find((u) => u.id === id);
  if (!user) return null;
  user.verified = !verified;
  return JSON.parse(JSON.stringify(user));
};
