import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from './authStore';

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface WorkspaceMember {
  userId: string;
  organizationId: string;
  role: UserRole;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface WorkspaceState {
  organizations: Organization[];
  members: WorkspaceMember[];
  invitations: Invitation[];
  
  createOrganization: (name: string, ownerId: string) => Organization;
  deleteOrganization: (orgId: string) => void;
  inviteMember: (orgId: string, email: string, role: UserRole, invitedBy: string) => Invitation;
  acceptInvitation: (invitationId: string, userId: string) => void;
  declineInvitation: (invitationId: string) => void;
  removeMember: (orgId: string, userId: string) => void;
  updateMemberRole: (orgId: string, userId: string, role: UserRole) => void;
  getOrgMembers: (orgId: string) => WorkspaceMember[];
  getOrgInvitations: (orgId: string) => Invitation[];
  getUserOrganizations: (userId: string) => Organization[];
}

function generateId(): string {
  return crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      organizations: [],
      members: [],
      invitations: [],

      createOrganization: (name, ownerId) => {
        const org: Organization = {
          id: generateId(),
          name,
          ownerId,
          createdAt: new Date().toISOString(),
        };
        const membership: WorkspaceMember = {
          userId: ownerId,
          organizationId: org.id,
          role: 'admin',
          joinedAt: new Date().toISOString(),
        };
        set(state => ({
          organizations: [...state.organizations, org],
          members: [...state.members, membership],
        }));
        return org;
      },

      deleteOrganization: (orgId) => {
        set(state => ({
          organizations: state.organizations.filter(o => o.id !== orgId),
          members: state.members.filter(m => m.organizationId !== orgId),
          invitations: state.invitations.filter(i => i.organizationId !== orgId),
        }));
      },

      inviteMember: (orgId, email, role, invitedBy) => {
        const invitation: Invitation = {
          id: generateId(),
          organizationId: orgId,
          email: email.toLowerCase(),
          role,
          invitedBy,
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        set(state => ({
          invitations: [...state.invitations, invitation],
        }));
        return invitation;
      },

      acceptInvitation: (invitationId, userId) => {
        const inv = get().invitations.find(i => i.id === invitationId);
        if (!inv) return;
        
        const membership: WorkspaceMember = {
          userId,
          organizationId: inv.organizationId,
          role: inv.role,
          joinedAt: new Date().toISOString(),
        };
        
        set(state => ({
          invitations: state.invitations.map(i => i.id === invitationId ? { ...i, status: 'accepted' as const } : i),
          members: [...state.members, membership],
        }));
      },

      declineInvitation: (invitationId) => {
        set(state => ({
          invitations: state.invitations.map(i => i.id === invitationId ? { ...i, status: 'declined' as const } : i),
        }));
      },

      removeMember: (orgId, userId) => {
        set(state => ({
          members: state.members.filter(m => !(m.organizationId === orgId && m.userId === userId)),
        }));
      },

      updateMemberRole: (orgId, userId, role) => {
        set(state => ({
          members: state.members.map(m =>
            m.organizationId === orgId && m.userId === userId ? { ...m, role } : m
          ),
        }));
      },

      getOrgMembers: (orgId) => get().members.filter(m => m.organizationId === orgId),
      getOrgInvitations: (orgId) => get().invitations.filter(i => i.organizationId === orgId),
      getUserOrganizations: (userId) => {
        const memberOrgIds = get().members.filter(m => m.userId === userId).map(m => m.organizationId);
        return get().organizations.filter(o => memberOrgIds.includes(o.id));
      },
    }),
    { name: 'visorybi-workspace' }
  )
);
