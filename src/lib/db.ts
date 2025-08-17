"use server"

import { PrismaClient, Project } from '@/generated/prisma'

const prisma = new PrismaClient()

export const getProjects = async () => {
  const projects: Project[] = await prisma.project.findMany();
  console.log("Get projects: ", projects);
  return projects;
};
