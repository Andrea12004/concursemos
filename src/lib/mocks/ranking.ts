// src/mocks/usuarios.mock.ts
import type { User } from '@/lib/types/user';

/**
 * Datos mock para desarrollo sin backend
 * Cambiar USE_MOCK_DATA a false cuando el backend esté disponible
 */
export const USE_MOCK_DATA = true;

/**
 * Lista de usuarios de prueba
 */
export const MOCK_USERS: User[] = [
    {
        id: '1',
        profile: {
            
            nickname: 'AdminPrincipal',
            City: 'Bogotá, Colombia',
            level: 'MASTER',
            Total_points: 5000,
        },
        lastName: '3001234567',
        role: 'ADMIN',
        lastPaymentDate: '2024-01-15',
        verified: true,
    },
    {
        id: '2',
        profile: {
            
            nickname: 'MariaGamer',
            City: 'Medellín, Colombia',
            level: 'MEGALODON',
            Total_points: 4200,
        },
        lastName: '3107654321',
        role: 'BASIC',
        lastPaymentDate: '2024-01-20',
        verified: true,
    },
    {
        id: '3',
        profile: {
           
            nickname: 'CarlosPro',
            City: 'Cali, Colombia',
            level: 'BALLENA',
            Total_points: 3500,
        },
        lastName: '3201239876',
        role: 'BASIC',
        lastPaymentDate: null,
        verified: false,
    },
    {
        id: '4',
        profile: {
          
            nickname: 'AnaMaster',
            City: 'Barranquilla, Colombia',
            level: 'TIBURON',
            Total_points: 3200,
        },
        lastName: '3159876543',
        role: 'BASIC',
        lastPaymentDate: '2024-01-18',
        verified: true,
    },
    {
        id: '5',
        profile: {
           
            nickname: 'LuisNovato',
            City: 'Cartagena, Colombia',
            level: 'PESCADO',
            Total_points: 890,
        },
        lastName: '3182345678',
        role: 'BASIC',
        lastPaymentDate: null,
        verified: false,
    },
    {
        id: '6',
        profile: {
            nickname: 'SofiaQueen',
            City: 'Bucaramanga, Colombia',
            level: 'MEGALODON',
            Total_points: 4500,
        },
        lastName: '3165432109',
        role: 'BASIC',
        lastPaymentDate: '2024-01-22',
        verified: true,
    },
    {
        id: '7',
        profile: {
            nickname: 'DiegoKing',
            City: 'Pereira, Colombia',
            level: 'BALLENA',
            Total_points: 3100,
        },
        lastName: '3198765432',
        role: 'BASIC',
        lastPaymentDate: '2024-01-16',
        verified: true,
    },
    {
        id: '8',
        profile: {
          
            nickname: 'PaulaChamp',
            City: 'Manizales, Colombia',
            level: 'DELFIN',
            Total_points: 1950,
        },
        lastName: '3176543210',
        role: 'BASIC',
        lastPaymentDate: null,
        verified: false,
    },
    {
        id: '9',
        profile: {
            
            nickname: 'AndresLegend',
            City: 'Santa Marta, Colombia',
            level: 'ORCA',
            Total_points: 2100,
        },
        lastName: '3145678901',
        role: 'BASIC',
        lastPaymentDate: '2024-01-19',
        verified: true,
    },
    {
        id: '10',
        profile: {
           
            nickname: 'CamilaElite',
            City: 'Ibagué, Colombia',
            level: 'BALLENA',
            Total_points: 3300,
        },
        lastName: '3123456789',
        role: 'BASIC',
        lastPaymentDate: '2024-01-21',
        verified: true,
    },
    {
        id: '11',
        profile: {
           
            nickname: 'JorgeWarrior',
            City: 'Pasto, Colombia',
            level: 'PESCADO',
            Total_points: 650,
        },
        lastName: '3189012345',
        role: 'BASIC',
        lastPaymentDate: null,
        verified: false,
    },
    {
        id: '12',
        profile: {
    
            nickname: 'ValentinaHero',
            City: 'Villavicencio, Colombia',
            level: 'DELFIN',
            Total_points: 1800,
        },
        lastName: '3167890123',
        role: 'BASIC',
        lastPaymentDate: '2024-01-17',
        verified: true,
    },
];

/**
 * Lista de usuarios de prueba para ranking
 */
export const MOCK_USERS_RANKING = MOCK_USERS.map((user, index) => ({
    ...user,
    profile: {
        ...user.profile,
        correct_answers: Math.floor(Math.random() * 500) + 50, // Entre 50 y 550
        Rooms_win: Math.floor(Math.random() * 100) + 10, // Entre 10 y 110
    },
})).sort((a, b) => b.profile.Total_points - a.profile.Total_points);

/**
 * Simular usuarios conectados (número aleatorio entre 5 y 15)
 */
export const getMockConnectedUsers = (): number => {
    return Math.floor(Math.random() * 11) + 5;
};

/**
 * Simular respuesta de autenticación
 */
export const getMockAuthResponse = (isAdmin: boolean = false) => ({
    accesToken: 'mock-token-123456',
    user: {
        profile: {
            id: isAdmin ? '1' : '2',
        },
        role: isAdmin ? 'ADMIN' : 'BASIC',
    },
});