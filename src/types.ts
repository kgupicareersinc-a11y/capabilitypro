/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TemplateId = 'corporate' | 'tender' | 'infrabuild' | 'digital' | 'boutique';

export interface ProjectPerformance {
  id: string;
  projectName: string;
  client: string;
  value: number; // in South African Rands (ZAR)
  year: number;
  status: 'completed' | 'draft';
  description: string;
}

export interface CapabilityStatement {
  id: string;
  title: string;
  templateId: TemplateId;
  companyName: string;
  registrationNumber: string;
  bbbeeLevel: string; // "1" | "2" | "3" | "4" | "non"
  overview: string;
  csdNumber: string; // Central Supplier Database MAAA number
  cidbGrade: string; // Construction Industry Development Board grade, e.g., "7GB", "Not Applicable"
  contactEmail: string;
  contactPhone: string;
  physicalAddress: string;
  services: string[]; // Primary Core Competencies
  differentiators: string[]; // Key Differentiators
  certifications: string[]; // Standards / Certifications
  pastPerformance: ProjectPerformance[];
  lastEdited: string; // ISO date string
}

export interface UserProfile {
  companyName: string;
  registrationNumber: string;
  bbbeeLevel: string;
  csdNumber: string;
  cidbGrade: string;
  contactEmail: string;
  contactPhone: string;
  physicalAddress: string;
  industry: string;
}
