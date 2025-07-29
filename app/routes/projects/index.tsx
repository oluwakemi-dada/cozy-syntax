import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { Project } from '~/types';
import type { Route } from './+types';
import ProjectCard from '~/components/ProjectCard';
import Pagination from '~/components/Pagination';

export const loader = async ({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> => {
  const res = await fetch('http://localhost:8000/projects');
  const data = await res.json();

  return { projects: data };
};

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const { projects } = loaderData as { projects: Project[] };
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');

  const projectsPerPage = 10;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Get current page projects
  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <h2 className='text-3xl text-white font-bold mb-8'>🚀 Projects</h2>

      <div className='grid gap-6 sm:grid-cols-2'>
        {currentProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setSearchParams}
      />
    </>
  );
};

export default ProjectsPage;
