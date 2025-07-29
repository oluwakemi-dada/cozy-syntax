import { useSearchParams } from 'react-router';
import type { Project } from '~/types';
import type { Route } from './+types';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectCard from '~/components/ProjectCard';
import Pagination from '~/components/Pagination';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Cozy Syntax | Projects' },
    { name: 'description', content: 'My website project portfolio' },
  ];
}

export const loader = async ({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`);
  const data = await res.json();

  return { projects: data };
};

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || 'All';

  const { projects } = loaderData as { projects: Project[] };

  // Get unique categories
  const categories = [
    'All',
    ...new Set(projects.map((project) => project.category)),
  ];

  // Filter projects by category
  const filteredProjects =
    category === 'All'
      ? projects
      : projects.filter((project) => project.category === category);

  const projectsPerPage = 10;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Get current page projects
  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast);

  const updatePage = (newPage: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage);
      return params;
    });
  };

  const updateCategory = (newCategory: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('category', newCategory);
      params.set('page', '1'); // reset to first page when filter changes
      return params;
    });
  };

  return (
    <>
      <h2 className='text-3xl text-white font-bold mb-8'>🚀 Projects</h2>

      <div className='flex flex-wrap gap-2 mb-8'>
        {categories.map((curCategory) => (
          <button
            key={curCategory}
            onClick={() => updateCategory(curCategory)}
            className={`px-3 py-1 rounded text-sm cursor-pointer ${curCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
          >
            {curCategory}
          </button>
        ))}
      </div>

      <AnimatePresence mode='wait'>
        <motion.div layout className='grid gap-6 sm:grid-cols-2'>
          {currentProjects.map((project) => (
            <motion.div key={project.id} layout>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={updatePage}
      />
    </>
  );
};

export default ProjectsPage;
