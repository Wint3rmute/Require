// DO NOT USE THIS MODULE FOR THE CURRENT MILESTONE
// IT IS A PROOF OF CONCEPT FROM PROTOTYPING PHASE.

"use server"

import { PrismaClient, Project } from '@/generated/prisma'
import { InterfaceFormData } from '@/components/create_interface_form';

const prisma = new PrismaClient()

export async function getProjects(): Promise<Project[]> {
  const projects: Project[] = await prisma.project.findMany();
  console.log("Get projects: ", projects);
  return projects;
};

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const project: Project | null = await prisma.project.findFirst({ where: { name: slug } });
  return project;
};

export async function getNumComponents(slug: string): Promise<number> {
  const num_subsystems: number = await prisma.componentDefinition.count({ where: { project: { name: slug } } });
  return num_subsystems;
}

export async function getNumInterfaces(slug: string): Promise<number> {
  const num_interfaces: number = await prisma.interfaceDefinition.count({ where: { project: { name: slug } } });
  return num_interfaces;
}

export async function createInterfaceDefinition(data: InterfaceFormData) {
  console.log("Creating iface definition");
  console.log(data);

  // Update data
  // Revalidate cache
}

