"use server"

import { PrismaClient, Project } from '@/generated/prisma'

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

export async function createInterfaceDefinition(formData: FormData) {
  // const project_name = formData.get('project_name')
  // const interface_name = formData.get('interface_name')
  // const description = formData.get('description')

  console.log("Creating iface definition");
  console.log(formData)

  // Update data
  // Revalidate cache
}

